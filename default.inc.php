<?php
		
// Plugin default configuration file.
// Override these entries in the global config file.
// Users can change exposed entries form the application settings ui.
$config = array();

// activate plugin features
$config['plugin.styled_popups.activate_plugin'] = true;

// permit plugin logging
$config['plugin.styled_popups.enable_logging'] = true;

///////// settings

// expose these settings in user ui
$config['plugin.styled_popups.settings_checkbox_list'] = array(
        'activate_plugin',
        'enable_logging', 
);

// expose these settings in user ui
$config['plugin.styled_popups.settings_select_list'] = array(
);

// expose these settings in user ui
$config['plugin.styled_popups.settings_area_list'] = array(
);

// expose these settings in user ui
$config['plugin.styled_popups.settings_text_list'] = array(
);

?>
