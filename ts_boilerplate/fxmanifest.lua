fx_version 'cerulean'
description 'TS FiveM React TS Mantine Boilerplate'
author 'Thomas | TS Scripts'
lua54 'yes'
game 'gta5'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
}

client_scripts {
    'client/**/*',
}

server_scripts {
    'server/**/*'
}

ui_page 'web/build/index.html'

files {
	'web/build/index.html',
	'web/build/**/*',
    'web/assets/**/*',
}