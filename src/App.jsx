import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import './App.css'; // Import custom CSS file for styling

// Redux store setup
const initialState = {
  theme: {
    foregroundColor: '#000',
    backgroundColor: '#fff',
  },
  portfolio: {
    name: '',
    designation: '',
    location: '',
    bio: '',
  },
  portfolios: [],
  user: {
    username: 'kushagra singh', 
  },
};

// Reducers and combined reducer
const themeReducer = (state = initialState.theme, action) => {
  switch (action.type) {
    case 'CHANGE_FOREGROUND_COLOR':
      return { ...state, foregroundColor: action.color };
    case 'CHANGE_BACKGROUND_COLOR':
      return { ...state, backgroundColor: action.color };
    default:
      return state;
  }
};

const portfolioReducer = (state = initialState.portfolio, action) => {
  switch (action.type) {
    case 'EDIT_PORTFOLIO':
      return { ...state, [action.field]: action.value };
    case 'RESET_PORTFOLIO':
      return initialState.portfolio; // Reset form after adding portfolio
    default:
      return state;
  }
};

const portfoliosReducer = (state = initialState.portfolios, action) => {
  switch (action.type) {
    case 'ADD_PORTFOLIO':
      return [...state, action.portfolio];
    default:
      return state;
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    // Add more user-related actions if needed
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  theme: themeReducer,
  portfolio: portfolioReducer,
  portfolios: portfoliosReducer,
  user: userReducer,
});

const store = createStore(rootReducer);

// Components with CSS
const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="color-picker">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const PortfolioForm = ({ portfolio, onChange, onAddPortfolio }) => {
  const handleAddPortfolio = (e) => {
    e.preventDefault();
    onAddPortfolio(portfolio); // Dispatch action to add portfolio
  };

  return (
    <form className="portfolio-form">
      <label>
        Name:
        <input
          type="text"
          value={portfolio.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </label>
      <label>
        Designation:
        <input
          type="text"
          value={portfolio.designation}
          onChange={(e) => onChange('designation', e.target.value)}
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          value={portfolio.location}
          onChange={(e) => onChange('location', e.target.value)}
        />
      </label>
      <label>
        Bio:
        <textarea
          value={portfolio.bio}
          onChange={(e) => onChange('bio', e.target.value)}
        />
      </label>
      <button type="submit" onClick={handleAddPortfolio}>Add Portfolio</button>
    </form>
  );
};

const PortfolioPreview = ({ portfolio, theme }) => {
  return (
    <div className="portfolio-preview" style={{ backgroundColor: theme.backgroundColor, color: theme.foregroundColor }}>
      <h1>{portfolio.name}</h1>
      <p>{portfolio.designation}</p>
      <p>{portfolio.location}</p>
      <p>{portfolio.bio}</p>
    </div>
  );
};

const PortfoliosTable = ({ portfolios }) => {
  return (
    <div className="portfolios-table">
      <h2>Portfolios</h2>
      {portfolios.length === 0 ? (
        <p>No portfolios added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Location</th>
              <th>Bio</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio, index) => (
              <tr key={index}>
                <td>{portfolio.name}</td>
                <td>{portfolio.designation}</td>
                <td>{portfolio.location}</td>
                <td>{portfolio.bio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const App = () => {
  const { username } = initialState.user; // Get username from initial state
  return (
    <Provider store={store}>
      <div className="container">
        <header className="header">
          <div className="header-user">
            Welcome, {username}
          </div>
          <ConnectedColorPicker type="foreground" />
          <ConnectedColorPicker type="background" />
        </header>
        <div className="content">
          <div className="sidebar">
            <div className="sidebar-logo">
              <img src="path_to_your_logo.png" alt="Logo" />
            </div>
            <ul className="sidebar-nav">
              <li><a href="#">Home</a></li>
              <li><a href="#">Schedule</a></li>
              <li><a href="#">Recommendation</a></li>
              <li><a href="#">Analytics</a></li>
              <li><a href="#">Profile</a></li>
              <li><a href="#">Inbox</a></li>
              <li><a href="#">Themes</a></li>
            </ul>
          </div>
          <div className="main">
            <ConnectedPortfolioForm />
            <ConnectedPortfolioPreview />
          </div>
          <ConnectedPortfoliosTable />
        </div>
      </div>
    </Provider>
  );
};

// Connect components with Redux
const mapStateToProps = (state) => ({
  theme: state.theme,
  portfolio: state.portfolio,
  portfolios: state.portfolios,
});

const mapDispatchToProps = (dispatch) => ({
  changeForegroundColor: (color) =>
    dispatch({ type: 'CHANGE_FOREGROUND_COLOR', color }),
  changeBackgroundColor: (color) =>
    dispatch({ type: 'CHANGE_BACKGROUND_COLOR', color }),
  editPortfolio: (field, value) =>
    dispatch({ type: 'EDIT_PORTFOLIO', field, value }),
  addPortfolio: (portfolio) => {
    dispatch({ type: 'ADD_PORTFOLIO', portfolio });
    dispatch({ type: 'RESET_PORTFOLIO' }); // Reset form after adding portfolio
  },
});

const ConnectedColorPicker = connect(
  ({ theme }, { type }) => ({
    color: type === 'foreground' ? theme.foregroundColor : theme.backgroundColor,
  }),
  (dispatch, { type }) => ({
    onChange: (color) =>
      type === 'foreground'
        ? dispatch({ type: 'CHANGE_FOREGROUND_COLOR', color })
        : dispatch({ type: 'CHANGE_BACKGROUND_COLOR', color }),
  })
)(ColorPicker);

const ConnectedPortfolioForm = connect(
  ({ portfolio }) => ({ portfolio }),
  (dispatch) => ({
    onChange: (field, value) =>
      dispatch({ type: 'EDIT_PORTFOLIO', field, value }),
    onAddPortfolio: (portfolio) =>
      dispatch({ type: 'ADD_PORTFOLIO', portfolio }),
  })
)(PortfolioForm);

const ConnectedPortfolioPreview = connect(
  ({ portfolio, theme }) => ({ portfolio, theme })
)(PortfolioPreview);

const ConnectedPortfoliosTable = connect(
  ({ portfolios }) => ({ portfolios })
)(PortfoliosTable);

export default App;
