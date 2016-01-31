function UsersList() {
    this.usersList = {};
}

UsersList.prototype.loadUsersList = function(usersListResponse){
    var i;

    for (i = 0; i < usersListResponse.members.length; i += 1) {
        this.usersList[usersListResponse.members[i].id] = usersListResponse.members[i].profile;
    }
};

module.exports = UsersList;

