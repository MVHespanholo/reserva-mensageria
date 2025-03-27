module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define('SubCategory', {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true
      }
    }, {
      tableName: 'subcategories',
      timestamps: false
    });
  
    SubCategory.associate = (models) => {
      SubCategory.belongsTo(models.Category, { 
        foreignKey: 'category_id',
        as: 'Category'
      });
      SubCategory.hasMany(models.ReservationRoom, { 
        foreignKey: 'sub_category_id',
        as: 'ReservationRooms'
      });
    };
  
    return SubCategory;
  };