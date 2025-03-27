module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true
      },
    }, {
      tableName: 'categories',
      timestamps: false
    });
  
    Category.associate = (models) => {
        Category.hasMany(models.SubCategory, { 
            foreignKey: 'category_id',
            as: 'SubCategories'  // Adicionado alias
        });
        Category.hasMany(models.ReservationRoom, { 
            foreignKey: 'category_id',
            as: 'ReservationRooms'  // Adicionado alias
        });
    };
  
    return Category;
  };