import { BehaviorSubject } from 'rxjs';

class AppService {
    constructor() {
        this.persons = new BehaviorSubject([]);
        this.team = new BehaviorSubject([]);
        this.player = new BehaviorSubject(null);
        this.state = new BehaviorSubject({ type: '', payload: null });
    }
}

export const appService = new AppService();
// window.appService = appService;
