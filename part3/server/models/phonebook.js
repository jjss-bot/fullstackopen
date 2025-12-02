import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('Unable to connect to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters'],
    required: [true, 'Name is required'],
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true,
    minLength: [9, 'Phone number must be at least 8 digits'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    require: [true, 'Phone number is required']
  }
});

personSchema.pre('save', function() {
  const name = this.name.toLowerCase().replace(/(\s+)/g, ' ');

  this.name = name.split(' ').map(w => {
    return (w.slice(0,1).toUpperCase() + w.slice(1));
  }).join(' ');
});

personSchema.set('toJSON', {
  transform: (document, returndObject) => {
    returndObject.id = returndObject._id.toString();
    delete returndObject._id;
    delete returndObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);

export default Person;