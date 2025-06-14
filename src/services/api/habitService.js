class HabitService {
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
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'frequency', 'category', 'created_at', 'current_streak', 'longest_streak', 'completion_rate']
      };
      
      const response = await this.apperClient.fetchRecords('habit', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'frequency', 'category', 'created_at', 'current_streak', 'longest_streak', 'completion_rate']
      };
      
      const response = await this.apperClient.getRecordById('habit', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching habit with ID ${id}:`, error);
      throw error;
    }
  }

  async create(habitData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: habitData.name,
        color: habitData.color,
        frequency: habitData.frequency,
        category: habitData.category,
        created_at: new Date().toISOString(),
        current_streak: 0,
        longest_streak: 0,
        completion_rate: 0
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord('habit', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create habit');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Map UI field names to database field names and only include Updateable fields
      const updateableData = {
        Id: id
      };
      
      if (updates.name !== undefined) updateableData.Name = updates.name;
      if (updates.color !== undefined) updateableData.color = updates.color;
      if (updates.frequency !== undefined) updateableData.frequency = updates.frequency;
      if (updates.category !== undefined) updateableData.category = updates.category;
      if (updates.currentStreak !== undefined) updateableData.current_streak = updates.currentStreak;
      if (updates.longestStreak !== undefined) updateableData.longest_streak = updates.longestStreak;
      if (updates.completionRate !== undefined) updateableData.completion_rate = updates.completionRate;
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord('habit', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update habit');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('habit', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete habit');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }

  async updateStats(id, stats) {
    return this.update(id, stats);
  }
}

export default new HabitService();