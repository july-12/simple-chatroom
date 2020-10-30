
function Store() {

  let userId = 1

  this.users = []
  this.messages = []

  this.userIn = function(name) {

    const user = {
      id: userId++,
      name: name || 'username'
    }
    this.users.push(user)
    return user
  }

this.userOut = function(user) {
    const idx =  this.users.findIndex(u => user.id === u.id)
    if(idx > -1) {
      this.users.splice(idx, 1)
    }
  }
}

const store = new Store()
console.log(store);

const user = store.userIn('user1')
const user3 = store.userIn('user3')
const user2 = store.userIn('user2')
console.log(user);
console.log(store.users)

store.userOut(user3)
console.log(store.users)

