import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    minLength: 3,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(this.password, saltRounds);
    this.password = passwordHash;
  }
});

export default mongoose.model('User', userSchema);