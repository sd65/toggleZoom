const Gtk = imports.gi.Gtk;
const Convenience = imports.misc.extensionUtils.getCurrentExtension().imports.lib.convenience;

const Gettext = imports.gettext.domain('toggleZoom');
const _ = Gettext.gettext;

let settings;

function init()
{
    settings = Convenience.getSettings();
	Convenience.initTranslations("toggleZoom");
}

function buildPrefsWidget() {

    // Objects

    let frame = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, border_width: 10, spacing: 10});

    let labelScale = new Gtk.Label({
        label: _("Zoom factor")+":\n<small>"+_("1.0 is normal, <1.0 is zoomed in, >1.0 is zoomed out.")+"</small>",
        use_markup: true,
        xalign: 0
    });
    frame.add(labelScale);

    let scale = new Gtk.HScale({
        digits:2,
        adjustment: new Gtk.Adjustment({lower: 0.1,upper: 2.0,step_increment: 0.05}),
        value_pos: Gtk.PositionType.RIGHT
    });
    scale.set_value(settings.get_double("scale"))
    frame.add(scale);

    let labelOutput = new Gtk.Label({
        label: _("Screen")+":\n<small>"+_("Pick your value by running this command")+":</small>\n<tt><small>xrandr | awk -F ' ' '/ connected/ { print $1}'</small></tt>",
        use_markup: true,
        xalign: 0
    });
    labelOutput.set_selectable(true);
    frame.add(labelOutput);

    let output = new Gtk.Entry
    ({
        hexpand: true,
        text: settings.get_string("output"),
    });
    frame.add(output);

    // Events

    scale.connect('value-changed', function(v) {
        settings.set_double("scale", v.get_value());
    });

    output.connect('changed', function(v) {
        settings.set_string("output", v.get_text());
    });

    frame.show_all();
    return frame;
}
