// import ChatPanelToggleButton from 'app/fuse-layouts/shared-components/chatPanel/ChatPanelToggleButton';
// import FullScreenToggle from '../../shared-components/FullScreenToggle';
// import FuseSearch from '@fuse/core/FuseSearch';
// import FuseShortcuts from '@fuse/core/FuseShortcuts';
// import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
// import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
// import { Icon, IconButton } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import { useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import Hidden from '@material-ui/core/Hidden';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';

const useStyles = makeStyles(theme => ({
	root: {}
}));

function ToolbarLayout1(props) {
	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const toolbarTheme = useSelector(selectToolbarTheme);

	const classes = useStyles(props);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx(classes.root, 'flex relative z-10 shadow-md')}
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.paper }}
			>
				<Toolbar className="p-0 min-h-48 md:min-h-64">
					{config.navbar.display && config.navbar.position === 'left' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
						</Hidden>
					)}

					<div className="flex flex-1">
						{/* <Hidden mdDown>
							<FuseShortcuts className="px-16" />
						</Hidden> */}
					</div>

					<div className="flex items-center px-8">
						{/* <LanguageSwitcher />

						<FullScreenToggle />

						<FuseSearch />

						<Hidden lgUp>
							<ChatPanelToggleButton />
						</Hidden> */}

						{/* <QuickPanelToggleButton /> */}
						{/* <IconButton className="w-40 h-40" onClick={() => undefined}>
							<Icon>notifications_none</Icon>
						</IconButton> */}

						<UserMenu />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton />
						</Hidden>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout1);
