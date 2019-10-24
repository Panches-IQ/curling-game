import { BehaviorSubject } from 'rxjs';

class AppService {
    constructor() {
        this.persons = new BehaviorSubject([]);
        this.team = new BehaviorSubject([]);
        this.player = new BehaviorSubject(null);
        this.state = new BehaviorSubject({ type: '', payload: null });
        this.teamName = new BehaviorSubject('');
        this.gamePlay = new BehaviorSubject(false);
    }
}

export const appService = new AppService();
// window.appService = appService;
