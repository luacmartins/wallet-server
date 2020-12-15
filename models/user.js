const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
         if (!validator.isEmail(value)) {
            throw new Error(`${value} is not a valid email.`)
         }
      }
   },
   password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8
   },
   categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
   institutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Institution' }],
   accounts: [],
   tokens: [{
      token: {
         type: String,
         required: true
      }
   }]
})

// create virtual link to other DB models
// userSchema.virtual('Category', {
//    ref: 'Category',
//    localField: '_id',
//    foreignField: 'owner'
// })

// generate JWT for user (methods is used to create token on each instance of User)
userSchema.methods.generateAuthToken = async function () {
   const user = this
   const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
   user.tokens = [...user.tokens, { token }]
   await user.save()

   return token
}

// authenticate user (statis is used to run it on the Model e.g. find user in the DB)
userSchema.statics.authenticate = async (email, password) => {
   const user = await User.findOne({ email })

   if (!user) throw new Error('Invalid credentials')
   const isMatch = await bcrypt.compare(password, user.password)
   if (!isMatch) throw new Error('Invalid credentials')
   return user
}

// Hash user passwod before saving to database
userSchema.pre('save', async function (next) {
   const user = this
   if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 9)
   }

   next()
})

// Delete user data when account is deleted
userSchema.pre('remove', async function (next) {
   const user = this
   // await Model.deleteMany({ owner: user._id })
   next()
})

const User = mongoose.model('User', userSchema)

module.exports = User