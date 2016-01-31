function UsersList() {
    this.usersList = {};
}

UsersList.prototype.loadUsersList = function(usersListResponse){
    var i;

    for (i = 0; i < usersListResponse.members.length; i += 1) {
        this.usersList[usersListResponse.members[i].id] = usersListResponse.members[i].profile;
        this.usersList[usersListResponse.members[i].gender] = "undef";
    }
};

UsersList.prototype.isUsersCreated = function(userId){
    if (this.usersList[userId]) {
        return true;
    } else {
        return false;
    }
};

UsersList.prototype.getEmail = function(userId){
    return this.usersList[userId].email;
};

UsersList.prototype.getFirstName = function(userId){
    return this.usersList[userId].first_name;
};

UsersList.prototype.getLastName = function(userId){
    return this.usersList[userId].last_name;
};

UsersList.prototype.getFullName = function(userId){
    return this.usersList[userId].real_name;
};

UsersList.prototype.setGender = function(userId, gender){
    return this.usersList[userId][gender] = gender;
};

UsersList.prototype.getGender = function(userId){
    if(this.usersList[userId].hasOwnProperty('gender')) {
        return this.usersList[userId].gender;
    }
};
module.exports = UsersList;

