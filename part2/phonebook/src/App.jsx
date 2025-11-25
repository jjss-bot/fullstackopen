import { useState, useEffect } from 'react'
import phoneBook from './services/phonebook'

function Notification({ message , success }) {
  const style = {
    color: success ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null;
  }

  return (
    <div style={ style }>
      { message }
    </div>
  );
}

function SearchFilter({ pattern, onPatternChange}) {
  return(
    <div>
      filter shown with: <input name="filter" value={pattern} onChange={onPatternChange}/>
    </div>
  );
}

function ContactForm({ onSubmitContact }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  function handleName(event) {
    setName(event.target.value);
  }

  function handlePhone(event) {
    setPhone(event.target.value);
  }

  function handleNewContact(event){
    event.preventDefault();
    onSubmitContact({ name, phone });
    setName('');
    setPhone('');
  }

  return(
    <div>
        <form onSubmit={handleNewContact}>
          <div>
            name: <input name="name"value={name} onChange={handleName}/>
          </div>
          <div>
            phone: <input name="phone" value={phone} onChange={handlePhone}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
    </div>
  );
}

function ContactList({ people, onDeleteContact }) {
  const contacts = people.map(p =>{
    return(
      <div key={p.id}>
        {p.name} {p.phone}
        <button onClick={() => onDeleteContact(p.id)}>delete</button>
      </div>
    );
  });

  return(
    <div>
      {contacts}
    </div>
  )
}

function App() {
  const [pattern, setPattern] = useState('');
  const [people, setPeople] = useState([]);
  const [msg, setMsg] = useState(null);
  const [success, setSuccess] = useState(true);

  useEffect(()=>{
    phoneBook
      .getAll()
      .then(response => {
        setPeople(response);
      });
  }, []);

  function handleNewContact(newContact) {
    // Delete extra whitespace
    const phone = newContact.phone.trim();
    const name = newContact.name.replace(/(\s+)/g, ' ').trim();
    
    if (name.length === 0) {
      return;
    }

    if (!phone.match(/\d+-\d+-\d+/g)) {
      alert('Incorrect phone format!');
      return;
    }

    let person = people.find(person => 
        person.name.toLowerCase() === name.toLowerCase());

    if (person !== undefined) {
      if (person.phone === phone) {
        alert(`${name} is already added to phonebook`);
        return;
      }

      if (window.confirm(`${person.name} is already added to the ` +
            'phonebook, Do you want to replace the old phone number ' +
            'with a new one?')) {

        phoneBook
          .update({...person, phone})
          .then(updatedPerson => {
            setSuccess(true);
            setMsg(`Updated ${person.name}`);
            setTimeout(() => { setMsg(null) }, 5000);
            setPeople(people.map(p => p.id === person.id ? updatedPerson : p));
          }).catch(err => {
            setSuccess(false);
            setMsg(`Information of ${person.name} ` +
                      'has already been removed from server');
            setTimeout(() => { setMsg(null) }, 5000);
            setPeople(people.filter(p => p.id !== person.id));
          });
      }

      return;
    }
    
    // Capitalize first letter of name
    let capitalizedName = name.split(' ').map(w => {
      return (w.slice(0,1).toUpperCase() + w.slice(1));
      }).join(' ');

    phoneBook
      .create({ name: capitalizedName, phone })
      .then(newContact => {
        setSuccess(true);
        setMsg(`Added ${capitalizedName}`);
        setTimeout(() => { setMsg(null) }, 5000);
        setPeople(people.concat(newContact));
      });
  }

  function handleNewPattern(event) {
    setPattern(event.target.value.trimStart());
  }

  function handleDeleteContact(id) {
    const person = people.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      phoneBook
        .del(id)
        .then(() => {
           setPeople(people.filter(p => p.id !== id));
        })
        .catch(err => {
          setPeople(people.filter(p => p.id !== id));
          alert(`Information of ${person.name} ` +
                      'has already been removed from server')
        });
    }
  }

  const filter = pattern.toLowerCase();
  const contacts = people.filter((person => {
    if (filter.length === '') {
      return true;
    } else {
      const name = person.name.toLowerCase();
      return (name.startsWith(filter));
    }
  }));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={ msg } success={ success }/>
      <SearchFilter pattern={pattern} onPatternChange={handleNewPattern}/>
      <ContactForm onSubmitContact={handleNewContact}/>
      <h2>Numbers</h2>
      <ContactList people={contacts} onDeleteContact={handleDeleteContact}/>
    </div>
  )
}

export default App;