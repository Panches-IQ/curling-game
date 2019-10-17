import axios from 'axios';
import { appService } from './app';
import { map } from 'lodash';

class PersonService {

    getPlayersList() {
        axios.get('/playerList.json')
            .then(res => {
                const data = map(res.data, (i, key) => (key = Object.keys(i)[0], { teamname: key, persons: map(i[key], a => ({ ...a, team: key })) }));
                appService.persons.next(data);
            })
            .catch(console.log);
    }

    getPerson(item) {
        axios.get(`/playerDetail/${item.id}.json`)
            .then(res => {
                appService.player.next(Object.assign(item, res.data));
            })
            .catch(console.log);
    }
}

export const personService = new PersonService();
