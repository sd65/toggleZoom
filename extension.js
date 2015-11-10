const St = imports.gi.St;
const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;
const Clutter = imports.gi.Clutter;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience=imports.misc.extensionUtils.getCurrentExtension().imports.lib.convenience;

let button, output, scale;

function setScale(scale) {
     Util.spawn(['xrandr', '--output', output, '--scale', scale  + "x" + scale])
}

function init() {
    
    // Vars

    let settings=Convenience.getSettings();
    let state = 1;
    output=settings.get_string("output")


    // Set default scale

    setScale("1")

    // Objects

    button = new St.Bin(
    {
        style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        track_hover: true
    });

    let icon = new St.Icon({style_class: "icon"});
    button.set_child(icon);

    // Events

    button.connect('button-press-event', function(o, e){
        // Refresh setting
        scale=settings.get_double("scale")
        if(e.get_button() == Clutter.BUTTON_PRIMARY)
        {
            if (state)
                setScale(scale)
            else
                setScale("1")
            state=1-state;
        }
        else
        {
            let app = Shell.AppSystem.get_default().lookup_app("gnome-shell-extension-prefs.desktop");
            if (app != null) {
                let info = app.get_app_info();
                let timestamp = global.display.get_current_time_roundtrip();
                info.launch_uris([Me.uuid], global.create_app_launch_context(timestamp, -1));
            }
        }
    });

    button.connect('enter-event', function(){
        icon.style_class = (state) ? 'iconPlus' : 'iconMinus'
    });

    button.connect('leave-event', function(){
        icon.style_class = 'icon'
    });
}


function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}


