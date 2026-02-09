import axios from 'axios'
const baseURL = 'http://localhost:3001/api/persons/'


function getAll() {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

function create(newPerson) {
    const request = axios.post(baseURL, newPerson);
    return request.then(response => response.data);
}

function del(id) {
    const request = axios.delete(baseURL + id);
    return request.then(response => response.data);
}

function update(person) {
    const request = axios.put(baseURL + person.id, person);
    return request.then(response => response.data);
}

export default { getAll, create, del, update };