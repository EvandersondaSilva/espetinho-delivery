import { getOrCreateSettings } from "./getOrCreateSettings";

class GetSettingsService {
    async execute() {
        return getOrCreateSettings();
    }
}

export { GetSettingsService };
