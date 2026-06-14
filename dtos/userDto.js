const UserDto = {

    single(user) {
        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            fecha_registro: user.fecha_registro
        };
    },

    list(users) {
        return users.map(u => UserDto.single(u));
    }
};

module.exports = UserDto;
