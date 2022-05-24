const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserByID) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: "Email or password not found" })
        }

        try{
            if (await bcrypt.compare(password, user.password)) {
                // password match
                return done(null, user)
            } else {
                // password not match
                return done (null, false, {message: "Email or password is false"})
            }

        } catch (e) {
            return done(e)
        }
    }

    passport.use (new localStrategy({usernameField: 'email'}, authenticateUser))    
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id))
    })
}

module.exports = initialize