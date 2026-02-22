import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
});

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('client', 'admin', 'super_admin'),
    defaultValue: 'client',
    allowNull: false
  },
  profile_picture: DataTypes.STRING,
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  password_changed_at: DataTypes.DATE,
  password_reset_token: DataTypes.STRING,
  password_reset_expires: DataTypes.DATE
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
        user.password_changed_at = new Date();
      }
    }
  }
});

// Tour Package Model
const TourPackage = sequelize.define('TourPackage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  duration_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 365
    }
  },
  category: {
    type: DataTypes.ENUM('adventure', 'cultural', 'beach', 'wildlife', 'luxury', 'budget'),
    allowNull: false
  },
  price_adult: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  price_child: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  max_capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    validate: {
      min: 1,
      max: 100
    }
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to the primary package image'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'published'
  },
  inclusions: DataTypes.TEXT,
  exclusions: DataTypes.TEXT,
  itinerary: DataTypes.TEXT
});

// Package Image Model
const PackageImage = sequelize.define('PackageImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Local file path stored by Multer'
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  caption: DataTypes.STRING
});

// ✅ CORRECT ASSOCIATION DEFINITION (Defined early)
// This uses 'tour_package_id' which matches your database column
TourPackage.hasMany(PackageImage, {
  foreignKey: 'tour_package_id',
  as: 'PackageImages',
  onDelete: 'CASCADE'
});

PackageImage.belongsTo(TourPackage, {
  foreignKey: 'tour_package_id',
  as: 'package'
});

// Booking Model
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  booking_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  special_requests: DataTypes.TEXT
});

// Booking Passenger Model
const BookingPassenger = sequelize.define('BookingPassenger', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  phone: DataTypes.STRING,
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 120
    }
  },
  passport_number: DataTypes.STRING,
  nationality: {
    type: DataTypes.STRING,
    defaultValue: 'Kenyan'
  }
});

// Payment Model
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  payment_method: {
    type: DataTypes.ENUM('mpesa', 'card', 'bank_transfer'),
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'KES'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  mpesa_checkout_request_id: DataTypes.STRING,
  mpesa_merchant_request_id: DataTypes.STRING,
  mpesa_result_code: DataTypes.INTEGER,
  mpesa_result_desc: DataTypes.STRING
});

// Review Model
const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 1000]
    }
  },
  is_verified_booking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// ===== INSTANCE METHODS =====
User.prototype.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function(JWTTimestamp) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(this.password_changed_at.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

User.prototype.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.password_reset_expires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// ===== GLOBAL ASSOCIATIONS =====
// Note: We do NOT re-define TourPackage <-> PackageImage here to avoid overwriting the correct one above.

User.hasMany(Booking, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

TourPackage.hasMany(Booking, { foreignKey: 'package_id', onDelete: 'CASCADE' });
Booking.belongsTo(TourPackage, { foreignKey: 'package_id' });

// ❌ REMOVED DUPLICATE: This was overwriting the correct association with 'package_id'
// TourPackage.hasMany(PackageImage, { foreignKey: 'package_id' ... }); 

Booking.hasMany(BookingPassenger, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
BookingPassenger.belongsTo(Booking, { foreignKey: 'booking_id' });

Booking.hasOne(Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'user_id' });

TourPackage.hasMany(Review, { foreignKey: 'package_id', onDelete: 'CASCADE' });
Review.belongsTo(TourPackage, { foreignKey: 'package_id' });

export {
  sequelize,
  Sequelize,
  User,
  TourPackage,
  PackageImage,
  Booking,
  BookingPassenger,
  Payment,
  Review
};