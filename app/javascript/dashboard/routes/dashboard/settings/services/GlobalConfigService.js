// app/javascript/dashboard/services/GlobalConfigService.js

class GlobalConfigService {
  static load(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
  }
}

export default GlobalConfigService;
