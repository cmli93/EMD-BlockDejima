const SimpleStore = artifacts.require('SimpleStore');

contract('SimpleStore', function(accounts){
  let storage;

  before(async function (){
    storage = await SimpleStore.new();
  });

  it('should init and change stored data', async function (){
    await storage.set(5);
    assert.equal(await storage.get(), 5);
  })

  it('should override on new set', async function (){
    await storage.set(160);
    assert.equal(await storage.get(), 160);
  });
})
