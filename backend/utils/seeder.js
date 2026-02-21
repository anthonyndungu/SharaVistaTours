import { sequelize, User, TourPackage, PackageImage, Review, Booking } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');

    // 2. Sync database (force: true drops and recreates tables)
    // WARNING: This deletes all existing data!
    await sequelize.sync({ force: true });
    console.log('✓ Database synchronized (tables recreated)');

    // 3. Create Users
    // Note: The User model 'beforeCreate' hook automatically hashes the password
    console.log('Creating users...');
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sharavista.com',
      phone: '0705048849',
      password: 'admin123', 
      role: 'super_admin',
      is_verified: true
    });
    // console.log('✓ Admin user created (email: admin@sharavista.com, pass: admin123)');

    const client = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0723456789',
      password: 'client123',
      role: 'client',
      is_verified: true
    });
    console.log('✓ Client user created (email: john@example.com, pass: client123)');

    // 4. Define Package Data
    const packagesData = [
      {
        title: 'Maasai Mara Safari Adventure',
        description: 'Experience the ultimate wildlife safari in Kenya\'s most famous national reserve. Witness the Great Migration, spot the Big Five, and immerse yourself in Maasai culture.',
        destination: 'Maasai Mara National Reserve',
        duration_days: 5,
        category: 'wildlife',
        price_adult: 45000.00,
        price_child: 35000.00,
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
        price_adult: 28000.00,
        price_child: 20000.00,
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
        price_adult: 65000.00,
        price_child: 0.00,
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
        price_adult: 22000.00,
        price_child: 18000.00,
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
        price_adult: 85000.00,
        price_child: 65000.00,
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
        price_adult: 8000.00,
        price_child: 5000.00,
        max_capacity: 25,
        is_featured: false,
        status: 'published',
        inclusions: 'Hotel accommodation, Breakfast, City tour, Transport',
        exclusions: 'Lunch & dinner, Entrance fees to optional attractions, Personal expenses'
      }
    ];

    // Unsplash Photo IDs for each package (3 images per package)
    const imageSets = [
      ['photo-1516426122078-c23e76319801', 'photo-1547471080-7528185270d4', 'photo-1534759846116-5799c33ce22a'], // Mara
      ['photo-1540206395-688085723adb', 'photo-1590523741831-ab7e8b8f9c78', 'photo-1584132967866-10e028bd69f7'], // Diani
      ['photo-1464822759085-2f3662c7ba4f', 'photo-1459664018906-085c36f472af', 'photo-1483729558449-99ef09a8c325'], // Mt Kenya
      ['photo-1586861767866-7e87a2e8a634', 'photo-1572454591674-2739f30d8c40', 'photo-1596401057633-565652b8ddbe'], // Lamu
      ['photo-1516426122078-c23e76319801', 'photo-1535941339077-2dd1c7963098', 'photo-1523805009345-7448845a9e53'], // Amboseli
      ['photo-1480714378408-67cf0d13bc1b', 'photo-1566073771259-6a8506099945', 'photo-1555396273-367ea4eb4db5']  // Nairobi
    ];

    // 5. Create Packages and Images
    console.log('Creating tour packages and gallery images...');
    
    for (let i = 0; i < packagesData.length; i++) {
      const pkgData = packagesData[i];
      
      // Create the package
      const createdPackage = await TourPackage.create(pkgData);
      
      // Prepare images with explicit foreign key
      const images = imageSets[i].map((photoId, index) => ({
        url: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`,
        is_primary: index === 0,
        caption: `${createdPackage.title} - View ${index + 1}`,
        tourPackageId: createdPackage.id // Explicitly link to the package
      }));
      
      // Bulk create images for this package
      await PackageImage.bulkCreate(images);
    }
    console.log('✓ Tour packages and images created');

    // 6. Create Reviews
    console.log('Creating sample reviews...');
    const users = await User.findAll();
    const tourPackages = await TourPackage.findAll();
    
    if (users.length > 0 && tourPackages.length > 0) {
      const reviews = [
        { 
          user_id: users[1].id, 
          package_id: tourPackages[0].id, 
          rating: 5, 
          comment: 'Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.', 
          is_verified_booking: true 
        },
        { 
          user_id: users[1].id, 
          package_id: tourPackages[1].id, 
          rating: 4, 
          comment: 'Beautiful beach and great service. Would definitely recommend for a relaxing getaway.', 
          is_verified_booking: true 
        },
        { 
          user_id: users[0].id, 
          package_id: tourPackages[2].id, 
          rating: 5, 
          comment: 'Challenging but rewarding climb. The views from the top were breathtaking!', 
          is_verified_booking: false 
        },
        { 
          user_id: users[1].id, 
          package_id: tourPackages[3].id, 
          rating: 5, 
          comment: 'Fascinating cultural experience. The history and architecture of Lamu are incredible.', 
          is_verified_booking: true 
        },
        { 
          user_id: users[0].id, 
          package_id: tourPackages[4].id, 
          rating: 5, 
          comment: 'Luxury at its finest! The views of Kilimanjaro and the elephant herds were unforgettable.', 
          is_verified_booking: false 
        },
        { 
          user_id: users[1].id, 
          package_id: tourPackages[5].id, 
          rating: 4, 
          comment: 'Great value for money. Perfect introduction to Nairobi for first-time visitors.', 
          is_verified_booking: true 
        }
      ];
      
      await Review.bulkCreate(reviews);
      console.log('✓ Sample reviews created');
    } else {
      console.log('⚠ Skipped reviews: Could not find users or packages.');
    }

    // Completion Message
    console.log('\n========================================');
    console.log('✓✓✓ DATABASE SEEDING COMPLETED ✓✓✓');
    console.log('========================================');
    console.log('\nDefault Credentials:');
    console.log('👤 Admin:  admin@travelease.com / admin123');
    console.log('👤 Client: john@example.com / client123');
    console.log('\n');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  seedDatabase();
}

export default seedDatabase;