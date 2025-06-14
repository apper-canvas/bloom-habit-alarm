class CheckInService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'habit_id', 'date', 'completed', 'note']
      };
      
      const response = await this.apperClient.fetchRecords('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      throw error;
    }
  }

  async getByHabitId(habitId) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'habit_id', 'date', 'completed', 'note'],
        where: [
          {
            FieldName: 'habit_id',
            Operator: 'ExactMatch',
            Values: [habitId.toString()]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching check-ins by habit ID:', error);
      throw error;
    }
  }

  async getByDate(date) {
    try {
      const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'habit_id', 'date', 'completed', 'note'],
        where: [
          {
            FieldName: 'date',
            Operator: 'StartsWith',
            Values: [dateStr]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching check-ins by date:', error);
      throw error;
    }
  }

  async getByHabitAndDate(habitId, date) {
    try {
      const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'habit_id', 'date', 'completed', 'note'],
        where: [
          {
            FieldName: 'habit_id',
            Operator: 'ExactMatch',
            Values: [habitId.toString()]
          },
          {
            FieldName: 'date',
            Operator: 'StartsWith',
            Values: [dateStr]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching check-in by habit and date:', error);
      throw error;
    }
  }

  async create(checkInData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: `Check-in ${Date.now()}`,
        habit_id: parseInt(checkInData.habitId),
        date: checkInData.date instanceof Date ? checkInData.date.toISOString() : checkInData.date,
        completed: checkInData.completed,
        note: checkInData.note || ''
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create check-in');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: id
      };
      
      if (updates.completed !== undefined) updateableData.completed = updates.completed;
      if (updates.note !== undefined) updateableData.note = updates.note;
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update check-in');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error('Error updating check-in:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete check-in');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting check-in:', error);
      throw error;
    }
  }

  async toggleCheckIn(habitId, date, completed = true, note = '') {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    const existing = await this.getByHabitAndDate(habitId, dateStr);
    
    if (existing) {
      if (completed) {
        return await this.update(existing.Id, { completed: true, note });
      } else {
        return await this.delete(existing.Id);
      }
    } else if (completed) {
      return await this.create({
        habitId,
        date: dateStr,
        completed: true,
        note
      });
    }
    
    return null;
  }
}

export default new CheckInService();