import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import SignUpModal from './SignUpModal';
import { useEffect, useState } from 'react';
import SignInModal from './SignInModal';
import { useAuth } from './auth/AuthContext';
import { sendAuthPublicReq, sendUserProtectedReq } from './api/useApi';
import { Collapse, Divider } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { getCredentialID } from './auth/authClientStore';
import PropTypes from 'prop-types';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { ColorModeList, ColorModeSelect } from './theme/ColorMode';
import { useThemeContext } from './theme/ThemeContextProvider';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: 10,
    top: 5,
    padding: '0 4px',
  },
}));

function ResponsiveAppBar(props) {
  const [openColorMode, setOpenColorMode] = useState(false);

  const { countItemInCart } = useCart()
  const nav = useNavigate()
  const { openSignInFromOutSide = false, setOpenSignInFromOutSide = function () { } } = props
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isAuthenticated, logout } = useAuth()
  const { theme } = useThemeContext();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setOpenColorMode(false)
    setAnchorElUser(null);
  };

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);
  const handleOpenSignIn = () => setOpenSignIn(true);
  const handleCloseSignIn = () => setOpenSignIn(false);
  const handleClickColorMode = () => {
    setOpenColorMode(!openColorMode);
  };
  useEffect(() => {
    setOpenSignIn(openSignInFromOutSide)
  }, [openSignInFromOutSide])

  useEffect(() => {
    if (setOpenSignInFromOutSide !== null) {
      setOpenSignInFromOutSide(openSignIn)
    }
  }, [openSignIn])

  const [profile, setProfile] = useState({
    username: "",
    coin: 0,
  })

  const [isLoading, setIsLoadding] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile()
    }
  }, [])

  const fetchUserProfile = () => {
    setIsLoadding(true)
    sendUserProtectedReq.get("/user/profile").
      then((res) => {
        setProfile({
          username: res.data.username,
          coin: res.data.coin
        })
      }).catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setIsLoadding(false)
      })
  }

  const handleLogout = () => {
    sendAuthPublicReq.post("/auth/logout", {
      credential_id: parseInt(getCredentialID())
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err.response);
    }).finally(() => {
      handleCloseUserMenu()
      logout()
      nav("/")
    })
  }

  const settings = [
    {
      lable: 'My Shelf',
      path: "/myshelf"
    },
    {
      lable: 'My Orders',
      path: "/myorder"
    }
  ];

  return (
    <AppBar position="static" sx={{ mb: '30px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '55px !important' }}>
          <AdbIcon sx={{ display: { xxs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            href='/'
            component="a"
            sx={{
              mr: 2,
              display: { xxs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Book-Store
          </Typography>


          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Book-Store
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>

          <Box sx={{
            [theme.breakpoints.down('sm')]: {
              display: 'none'
            }
          }}>

          </Box>
          {isAuthenticated ?
            <>
              {
                isLoading ? <Typography>Loading...</Typography> :
                  <>
                    <StyledBadge
                      badgeContent={countItemInCart}
                      color="secondary"
                      sx={{
                        [theme.breakpoints.down('sm')]: {
                          display: 'none'
                        }
                      }}>
                      <Button
                        variant='outlined'
                        color='rgba(0,0,0,0.5)'
                        startIcon={
                          <ShoppingCartOutlinedIcon />
                        }
                        sx={{
                          color: 'inherit',
                          mr: '10px',
                        }}
                        onClick={() => { nav('/mycart') }}
                      >My Cart
                      </Button>
                    </StyledBadge>
                    <Button onClick={handleOpenUserMenu} variant='contained' color='rgba(0,0,0,0.5)'>Hello {profile.username ? profile.username : ""}</Button>
                  </>
              }
            </> :

            <>
              <ColorModeSelect />
              <Button sx={{ color: 'inherit', display: 'block' }} onClick={handleOpenSignIn}>Sign In</Button>
              <Button sx={{ color: 'inherit', display: 'block' }} onClick={handleOpenSignUp} >Sign Up</Button>
            </>}
          <Box sx={{ flexGrow: 0 }}>
            <Menu
              sx={{ mt: '30px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box display={'flex'} p={'20px'} flexDirection={'column'} alignItems={'center'} gap={'10px'}>
                <Typography>{profile.username ? profile.username : ""}</Typography>
                <Box display={'flex'} alignItems={'center'} gap={'7px'}>
                  <MonetizationOnIcon fontSize="small" />
                  <Typography> {profile.coin ? profile.coin : "?"}</Typography>
                </Box>
                <Button variant='outlined' color="error" onClick={handleLogout}>Log out</Button>
              </Box>
              <Divider />
              {settings.map((setting, idx) => (
                <MenuItem key={idx} onClick={() => nav(setting.path)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting.lable}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={() => nav('/mycart')}>
                My Cart ({countItemInCart})
              </MenuItem>
              <MenuItem onClick={handleClickColorMode}>
                Color mode
                {openColorMode ? <ExpandLess /> : <ExpandMore />}
              </MenuItem>
              <Collapse in={openColorMode} timeout="auto" unmountOnExit>
                <ColorModeList />
              </Collapse>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <SignUpModal open={openSignUp} handleClose={handleCloseSignUp} />
      <SignInModal open={openSignIn} handleClose={handleCloseSignIn} />
    </AppBar>
  );
}
export default ResponsiveAppBar;

ResponsiveAppBar.propTypes = {
  openSignInFromOutSide: PropTypes.bool,
  setOpenSignInFromOutSide: PropTypes.func
}

