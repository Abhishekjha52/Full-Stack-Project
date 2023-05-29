export const NOTIF_WISHLIST_CHANGED = "notif_wishlist_changed";

var observers = {};
let instance = null;

class NotificationService {//singleton service
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    postNotification = (notifyName, data) => {
        let obs = observers[notifyName];
        for (var x = 0; x < obs.length; x++) {
            var obj = obs[x];
            obj.callBack(data);
        }
    }

    removeObserver = (observer, notifyName) => {
        var obs = observers[notifyName];

        if (obs) {
            for (var x = 0; x < obs.length; x++) {
                if (observer === obs[x].observer) {
                    obs.splice(x, 1);
                    observers[notifyName] = obs;
                    break;
                }
            }
        }
    }

    addObserver = (notifyName, observer, callBack) => {
        let obs = observers[notifyName];

        if (!obs) {
            observers[notifyName] = [];
        }

        let obj = { observer: observer, callBack: callBack };
        observers[notifyName].push(obj);
    }
}

export default NotificationService;


