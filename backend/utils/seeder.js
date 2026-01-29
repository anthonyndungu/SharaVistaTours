import { sequelize, User, TourPackage, PackageImage, Review, Booking } from '../models/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; // ✅ ADD THIS IMPORT
import path from 'path'; // ✅ ADD THIS IMPORT

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');

    // Sync database (this will drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('✓ Database synchronized');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@travelease.com',
      phone: '0712345678',
      password: adminPassword,
      role: 'super_admin',
      is_verified: true
    });
    console.log('✓ Admin user created');

    // Create sample client user
    const clientPassword = await bcrypt.hash('client123', 12);
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0723456789',
      password: clientPassword,
      role: 'client',
      is_verified: true
    });
    console.log('✓ Sample client user created');

    // Create tour packages
    const packages = [
      {
        title: 'Maasai Mara Safari Adventure',
        description: 'Experience the ultimate wildlife safari in Kenya\'s most famous national reserve. Witness the Great Migration, spot the Big Five, and immerse yourself in Maasai culture.',
        destination: 'Maasai Mara National Reserve',
        duration_days: 5,
        category: 'wildlife',
        price_adult: 45000,
        price_child: 35000,
        max_capacity: 12,
        is_featured: true,
        status: 'published',
        inclusions: 'Accommodation, All meals, Game drives, Park fees, Professional guide, Transport',
        exclusions: 'International flights, Travel insurance, Tips, Personal expenses',
        itinerary: 'Day 1: Arrival and transfer to camp. Day 2-4: Full day game drives. Day 5: Morning game drive and departure.'
      },
      {
        title: 'Diani Beach Paradise Getaway',
        description: 'Relax on pristine white sand beaches with crystal-clear turquoise waters. Perfect for families and couples seeking sun, sea, and relaxation.',
        destination: 'Diani Beach, Mombasa',
        duration_days: 4,
        category: 'beach',
        price_adult: 28000,
        price_child: 20000,
        max_capacity: 20,
        is_featured: true,
        status: 'published',
        inclusions: 'Beachfront accommodation, Breakfast & dinner, Airport transfers, Beach activities',
        exclusions: 'Lunch, Water sports, Spa treatments, Travel insurance'
      },
      {
        title: 'Mount Kenya Climbing Expedition',
        description: 'Challenge yourself with an unforgettable climb up Africa\'s second-highest mountain. Experience diverse ecosystems and breathtaking views.',
        destination: 'Mount Kenya',
        duration_days: 6,
        category: 'adventure',
        price_adult: 65000,
        price_child: 0,
        max_capacity: 8,
        is_featured: false,
        status: 'published',
        inclusions: 'Professional guides, Mountain fees, Camping equipment, All meals, Transport',
        exclusions: 'Climbing gear rental, Travel insurance, Tips, Personal climbing equipment'
      },
      {
        title: 'Lamu Island Cultural Experience',
        description: 'Discover the rich Swahili culture and history of Lamu Old Town, a UNESCO World Heritage Site. Explore ancient architecture and pristine beaches.',
        destination: 'Lamu Island',
        duration_days: 3,
        category: 'cultural',
        price_adult: 22000,
        price_child: 18000,
        max_capacity: 15,
        is_featured: false,
        status: 'published',
        inclusions: 'Heritage hotel accommodation, All meals, Boat transfers, Cultural tours',
        exclusions: 'Flights, Travel insurance, Shopping, Optional activities'
      },
      {
        title: 'Luxury Amboseli Safari',
        description: 'Experience luxury camping with stunning views of Mount Kilimanjaro. Witness large elephant herds and enjoy premium safari experiences.',
        destination: 'Amboseli National Park',
        duration_days: 4,
        category: 'luxury',
        price_adult: 85000,
        price_child: 65000,
        max_capacity: 6,
        is_featured: true,
        status: 'published',
        inclusions: 'Luxury tented camp, Gourmet meals, Private game drives, Park fees, Champagne sundowners',
        exclusions: 'Flights, Travel insurance, Tips, Spa treatments'
      },
      {
        title: 'Budget Nairobi City Tour',
        description: 'Explore Kenya\'s vibrant capital city on a budget-friendly tour. Visit museums, markets, and wildlife sanctuaries within the city.',
        destination: 'Nairobi',
        duration_days: 2,
        category: 'budget',
        price_adult: 8000,
        price_child: 5000,
        max_capacity: 25,
        is_featured: false,
        status: 'published',
        inclusions: 'Hotel accommodation, Breakfast, City tour, Transport',
        exclusions: 'Lunch & dinner, Entrance fees to optional attractions, Personal expenses'
      }
    ];

    // Create packages and their images
    for (const pkg of packages) {
      const createdPackage = await TourPackage.create(pkg);
      
      // Add images for each package
      const images = [
        {
          url: `https://images.unsplash.com/photo-1503220317375-aaad61436b1b?${createdPackage.id}`,
          is_primary: true,
          caption: `${createdPackage.title} - Main View`,
          package_id: createdPackage.id
        },
        {
          url: `https://images.unsplash.com/photo-1464822759085-2f3662c7ba4f?${createdPackage.id}`,
          is_primary: false,
          caption: `${createdPackage.title} - Scenic View`,
          package_id: createdPackage.id
        },
        {
          url: `https://images.unsplash.com/photo-1476820865390-c52aeebb9891?${createdPackage.id}`,
          is_primary: false,
          caption: `${createdPackage.title} - Accommodation`,
          package_id: createdPackage.id
        }
      ];
      
      await PackageImage.bulkCreate(images);
    }
    console.log('✓ Tour packages and images created');

    // Create sample reviews
    const users = await User.findAll();
    const tourPackages = await TourPackage.findAll();
    
    const reviews = [
      { user_id: users[1].id, package_id: tourPackages[0].id, rating: 5, comment: 'Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.', is_verified_booking: true },
      { user_id: users[1].id, package_id: tourPackages[1].id, rating: 4, comment: 'Beautiful beach and great service. Would definitely recommend for a relaxing getaway.', is_verified_booking: true },
      { user_id: users[0].id, package_id: tourPackages[2].id, rating: 5, comment: 'Challenging but rewarding climb. The views from the top were breathtaking!', is_verified_booking: false },
      { user_id: users[1].id, package_id: tourPackages[3].id, rating: 5, comment: 'Fascinating cultural experience. The history and architecture of Lamu are incredible.', is_verified_booking: true },
      { user_id: users[0].id, package_id: tourPackages[4].id, rating: 5, comment: 'Luxury at its finest! The views of Kilimanjaro and the elephant herds were unforgettable.', is_verified_booking: false },
      { user_id: users[1]. id, package_id: tourPackages[5].id, rating: 4, comment: 'Great value for money. Perfect introduction to Nairobi for first-time visitors.', is_verified_booking: true }
    ];
    
    await Review.bulkCreate(reviews);
    console.log('✓ Sample reviews created');

    console.log('\n✓✓✓ Database seeding completed successfully! ✓✓✓');
    console.log('\nDefault credentials:');
    console.log('Admin: admin@travelease.com / admin123');
    console.log('Client: john@example.com / client123');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}

export default seedDatabase;