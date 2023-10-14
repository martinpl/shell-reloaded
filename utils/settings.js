import Gio from "gi://Gio"

export const getSettings = (key, extension) =>
    new Gio.Settings({
        settings_schema: Gio.SettingsSchemaSource.new_from_directory(
            extension.dir.get_child("schemas").get_path(),
            Gio.SettingsSchemaSource.get_default(),
            false
        ).lookup(extension.metadata[key], true),
    })
