const {sequelize,mongoose} = require('./dbs/connectDB');
const User = require('./models/mongoSchemas/userSchema');
const MenuCategory = require('./models/mongoSchemas/categorySchema');
const MenuItem = require('./models/mongoSchemas/itemSchema');

const SyncLockSchema = new mongoose.Schema({
    collectionName: String,
    isLocked: Boolean,
    lastUpdated: Date
});

const SyncLock = mongoose.model('SyncLock', SyncLockSchema);

async function acquireLock(collectionName) {
    const lock = await SyncLock.findOne({ collectionName });
    if (!lock) {
        await SyncLock.create({ collectionName, isLocked: true, lastUpdated: new Date() });
        return true;
    }
    // console.log('lock:',lock);
    if (!lock.isLocked) {
        await SyncLock.updateOne({ collectionName }, { $set: { isLocked: true, lastUpdated: new Date() } });
        return true;
    }
    return false;
}

//release lock 
async function releaseLock(collectionName) {
    await SyncLock.updateOne({ collectionName }, { $set: { isLocked: false } });
}

async function syncData() {
    console.log('Sync job started');

    const lockAcquired = await acquireLock('lock');
    // console.log('lockAcquired:',lockAcquired);
    if (!lockAcquired) {
        console.log('Lock is already acquired, sync skipped');
        return;
    }

    try {
        // Fetch users
        const [users] = await sequelize.query('SELECT * FROM users;');
        // console.log('users:', users);

        // Sync users
        for (let user of users) {
            await User.updateOne({ id: user.id }, user, { upsert: true });
        }

        // Fetch categories
        const [categories] = await sequelize.query('SELECT * FROM menu_categories');
        // console.log('categories:', categories);

        // Sync categories
        for (let category of categories) {
            await MenuCategory.updateOne({ id: category.id }, category, { upsert: true });
        }

        // Fetch items
        const [items] = await sequelize.query('SELECT * FROM menu_items');
        // console.log('items:', items);

        // Sync items
        for (let item of items) {
            await MenuItem.updateOne({ id: item.id }, item, { upsert: true });
        }

        console.log('Data synced successfully');
        const release=await releaseLock('lock');
        console.log('release:',release);
    } catch (err) {
        console.error('Error during data sync:', err);
        await releaseLock('lock');
    }
}

module.exports={
    SyncLock,
    acquireLock,
    releaseLock,
    syncData
};

