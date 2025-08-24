import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Box,
  Avatar,
  Fade,
  Slide
} from '@material-ui/core';
import { 
  Work, 
  Business, 
  TrendingUp, 
  People, 
  Star
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  heroSection: {
    position: 'relative',
    zIndex: 2,
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
  },
  heroTitle: {
    fontWeight: 700,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    fontSize: '1.2rem',
    fontWeight: 300,
  },
  searchCard: {
    borderRadius: 16,
    padding: theme.spacing(3),
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    marginBottom: theme.spacing(6),
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: 'white',
    },
  },
  searchButton: {
    borderRadius: 12,
    padding: theme.spacing(1.5, 4),
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)',
    },
  },
  statsSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
  statCard: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    padding: theme.spacing(3),
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#FFD700',
    marginBottom: theme.spacing(1),
  },
  statLabel: {
    color: 'white',
    fontWeight: 500,
  },
  featuresSection: {
    background: 'white',
    padding: theme.spacing(8, 0),
    marginTop: theme.spacing(6),
  },
  featureCard: {
    textAlign: 'center',
    padding: theme.spacing(4),
    borderRadius: 16,
    height: '100%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    },
  },
  featureIcon: {
    fontSize: 48,
    color: '#667eea',
    marginBottom: theme.spacing(2),
  },
  companiesSection: {
    background: '#f8f9fa',
    padding: theme.spacing(6, 0),
  },
  companyLogo: {
    width: 80,
    height: 80,
    margin: 'auto',
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  ctaSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(8, 0),
    textAlign: 'center',
  },
  ctaButton: {
    borderRadius: 25,
    padding: theme.spacing(1.5, 4),
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    margin: theme.spacing(0, 1),
    minWidth: 160,
  },
  primaryButton: {
    background: 'white',
    color: '#667eea',
    '&:hover': {
      background: '#f5f5f5',
    },
  },
  secondaryButton: {
    border: '2px solid white',
    color: 'white',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
    },
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    zIndex: 1,
  },
  floatingShape: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    animation: '$float 6s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}));

const Welcome = (props) => {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setVisible(true);
  }, []);

  const stats = [
    { number: '50K+', label: 'Active Jobs' },
    { number: '25K+', label: 'Companies' },
    { number: '2M+', label: 'Job Seekers' },
    { number: '98%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: <Work className={classes.featureIcon} />,
      title: 'Smart Job Matching',
      description: 'AI-powered algorithms match you with the perfect job opportunities based on your skills and preferences.',
    },
    {
      icon: <Business className={classes.featureIcon} />,
      title: 'Career Growth',
      description: 'Access to premium career resources, skill assessments, and personalized career guidance.',
    },
    {
      icon: <TrendingUp className={classes.featureIcon} />,
      title: 'Industry Insights',
      description: 'Stay updated with the latest industry trends, salary insights, and market demands.',
    },
    {
      icon: <People className={classes.featureIcon} />,
      title: 'Professional Network',
      description: 'Connect with industry professionals, mentors, and potential employers in your field.',
    },
  ];

  const companies = [
    { name: 'Google', initial: 'G' },
    { name: 'Microsoft', initial: 'M' },
    { name: 'Amazon', initial: 'A' },
    { name: 'Apple', initial: 'A' },
    { name: 'Netflix', initial: 'N' },
    { name: 'Tesla', initial: 'T' },
  ];

  return (
    <div className={classes.root}>
      {/* Background Decorations */}
      <div className={classes.backgroundDecoration}>
        <div 
          className={classes.floatingShape}
          style={{
            width: 100,
            height: 100,
            top: '10%',
            left: '10%',
            animationDelay: '0s',
          }}
        />
        <div 
          className={classes.floatingShape}
          style={{
            width: 150,
            height: 150,
            top: '20%',
            right: '15%',
            animationDelay: '2s',
          }}
        />
        <div 
          className={classes.floatingShape}
          style={{
            width: 80,
            height: 80,
            bottom: '30%',
            left: '20%',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Hero Section */}
      <Container maxWidth="lg" className={classes.heroSection}>
        <Fade in={visible} timeout={1000}>
          <div>
            <Typography variant="h2" className={classes.heroTitle}>
              Find Your Dream Job Today
            </Typography>
            <Typography variant="h6" className={classes.heroSubtitle}>
              Connect with top employers and discover opportunities that match your skills and ambitions
            </Typography>
          </div>
        </Fade>

        {/* Get Started Section */}
        <Slide in={visible} direction="up" timeout={1200}>
          <Box textAlign="center" style={{ marginBottom: 48 }}>
            <Button
              variant="contained"
              size="large"
              className={classes.searchButton}
              onClick={() => history.push('/jobs')}
              style={{ 
                fontSize: '1.2rem',
                padding: '16px 48px',
                borderRadius: 25,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 200
              }}
            >
              Get Started
            </Button>
          </Box>
        </Slide>

        {/* Stats Section */}
        <Slide in={visible} direction="up" timeout={1400}>
          <Grid container spacing={3} className={classes.statsSection}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card className={classes.statCard}>
                  <Typography className={classes.statNumber}>
                    {stat.number}
                  </Typography>
                  <Typography className={classes.statLabel}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Slide>
      </Container>

      {/* Features Section */}
      <div className={classes.featuresSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom style={{ fontWeight: 700, color: '#333', marginBottom: 48 }}>
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card className={classes.featureCard}>
                  <CardContent>
                    {feature.icon}
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* Companies Section */}
      <div className={classes.companiesSection}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 600, color: '#333', marginBottom: 48 }}>
            Trusted by Top Companies
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {companies.map((company, index) => (
              <Grid item xs={4} md={2} key={index}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar className={classes.companyLogo}>
                    {company.initial}
                  </Avatar>
                  <Typography variant="body2" style={{ fontWeight: 600, color: '#666' }}>
                    {company.name}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* CTA Section */}
      <div className={classes.ctaSection}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom style={{ color: 'white', fontWeight: 700, marginBottom: 24 }}>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" gutterBottom style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 40 }}>
            Join thousands of professionals who found their dream jobs through our platform
          </Typography>
        </Container>
      </div>
    </div>
  );
};

export const ErrorPage = (props) => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh', textAlign: 'center' }}
        >
          <Grid item>
            <Typography variant="h1" style={{ fontSize: '8rem', fontWeight: 700, color: 'white', marginBottom: 16 }}>
              404
            </Typography>
            <Typography variant="h4" style={{ color: 'white', marginBottom: 16, fontWeight: 600 }}>
              Page Not Found
            </Typography>
            <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
              The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button
              variant="contained"
              size="large"
              className={`${classes.ctaButton} ${classes.primaryButton}`}
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Welcome;