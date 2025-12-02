import mongoose from 'mongoose';

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Arguments: password [name phone]');
  process.exit(1);
}

const password = process.argv[2];
const newPerson = (process.argv.length !== 5) ? null : {
  name: process.argv[3],
  phone: process.argv[4]
};

const url = `mongodb+srv://jjss2919_db_user:${password}`+
            '@cluster0.phm4dwx.mongodb.net/phonebook?appName=Cluster0';


mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  phone: String
});

const Person = mongoose.model('Person', personSchema);

if (newPerson) {
  new Person({ ...newPerson }).save().then(() => {
    console.log(`added ${newPerson.name} phone ${newPerson.phone} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(person.name, person.phone);
    });
    mongoose.connection.close();
  });
}
