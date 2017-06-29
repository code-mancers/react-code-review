import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { checkEmailExistenceAction, doSignup } from '../../actions/signupActions';
import { doLogin } from '../../actions/authenticationActions';
import Icon1 from '../../../assets/images/nw-su-1@2x.png';
import Icon2 from '../../../assets/images/nw-su-2@2x.png';
import Icon3 from '../../../assets/images/nw-su-3@2x.png';
import arrow from '../../../assets/images/right-arrow@2x.png';
import './NewSignup.scss';
const FLOW = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
};

const EmailRegex = /^([\\.a-zA-Z0-9_\\-])+@([a-zA-Z0-9_\\-])+(([a-zA-Z0-9_\\-])*\.([a-zA-Z0-9_ \\-])+)+$/;
const PasswordRegex = /^[^\s]{8,}$/;

class NewSignup extends Component {
  static propTypes = {
    doSignup: PropTypes.func,
    doLogin: PropTypes.func,
    checkEmailExistenceAction: PropTypes.func,
    location: PropTypes.shape({
      query: PropTypes.shape({
        redirect_url: PropTypes.string,
      }),
    }),
  };
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      emailExists: false,
      showPasswordField: false,
      flow: null,
      errors: {},
    };
    this.checkEmail = this.checkEmail.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleCheckEmailNotifier = this.handleCheckEmailNotifier.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.doSignup = this.doSignup.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.validator = this.validator.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }
  handleKeyPress(e) {
    const { showPasswordField, flow } = this.state;
    if (e.keyCode === 13) {
      if (showPasswordField) {
        if (flow === flow.LOGIN) {
          this.doLogin(e);
        } else {
          this.doSignup(e);
        }
      } else {
        this.checkEmail(e)
      }
    }
  }
  handleOnChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    }, () => {
      this.validator([name]);
    });
  }
  handleCheckEmailNotifier() {
    const { emailExists } = this.state;
    this.setState({
      emailExists: !emailExists,
    });
  }
  checkEmail(e) {
    e.preventDefault();
    this.validator(['email']);
    const { email, errors } = this.state;
    if (!errors.email) {
      this.props.checkEmailExistenceAction({ email })
        .then((response) => {
          if (response.data.external_id) {
            this.setState({
              showPasswordField: true,
              flow: FLOW.LOGIN,
              emailExists: false,
            });
          } else {
            this.setState({
              showPasswordField: true,
              flow: FLOW.SIGNUP,
              emailExists: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            emailExists: true,
          });
        });
    }
  }
  doLogin(e) {
    e.preventDefault();
    this.validator(['email', 'password']);
    const { location: { query: { redirect_url } } } = this.props;
    const { email, password, errors } = this.state;
    if (!errors.email && !errors.password) {
      this.props.doLogin({
        name: email,
        password,
      }, redirect_url);
    }
  }
  doSignup(e) {
    e.preventDefault();
    this.validator(['email', 'password']);
    const { email, password, errors } = this.state;
    if (!errors.email && !errors.password) {
      this.props.doSignup({
        email,
        password,
      });
    }
  }
  handleGoBack() {
    this.setState({
      showPasswordField: false,
      password: '',
      flow: null,
    });
  }
  validator(fields) {
    const { email, password } = this.state;
    const errors = {};
    fields.forEach((field) => {
      if (field === 'email') {
        if (!email) {
          errors.email = 'Email address is required';
        } else if (!EmailRegex.test(email)) {
          errors.email = 'Please enter a valid email address';
        }
      } else if (field === 'password') {
        if (!password) {
          errors.password = 'Password is required';
        } else if (!PasswordRegex.test(password)) {
          errors.password = 'Must be greater than 7 characters (Spaces not allowed)';
        }
      }
    });

    this.setState({ errors });
  }
  render() {
    const { emailExists, email, showPasswordField, flow, errors } = this.state;
    return (
      <div className="row signup-container">
        <div className="medium-6 columns">
          <div className="signup__help-text">
            <div className="header">
              Sign up for a free trial
              <span>
                till September 2017
              </span>
            </div>
            <div className="body">
              <div className="body-title">
                By signing up, you will
              </div>
              <div className="list">
                <div className="list-item">
                  <div className="avatar">
                    <img src={Icon1} alt="list-avatar" />
                  </div>
                  <div className="text">
                    Learn how to generate GST-compliant invoices.
                  </div>
                </div>
                <div className="list-item">
                  <div className="avatar">
                    <img src={Icon2} alt="list-avatar" />
                  </div>
                  <div className="text">
                    Learn how to file your GSTR1 and GSTR2.
                  </div>
                </div>
                <div className="list-item">
                  <div className="avatar">
                    <img src={Icon3} alt="list-avatar" />
                  </div>
                  <div className="text">
                    Attend training sessions on using ClearTax GST.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="medium-6 columns">
          {
            emailExists &&
            <div className="signup__error-notification">
              Email id already exists. Click here to <Link to="/login">Login</Link>
              <div className="popup__close" onClick={this.handleCheckEmailNotifier}>
                <span />
                <span />
              </div>
            </div>
          }
          <div className="signup__form-container">
            <form id="signup-form">
              {
                !showPasswordField ? (
                  <div className="step-1">
                    <div className="form-header">
                      Welcome to ClearTax GST
                    </div>
                    {/* <button className="oauth-btn" onClick={e => e.preventDefault()}>
                      SIGN UP WITH GOOGLE
                    </button>
                    <div className="separator">
                      or
                    </div> */}
                    <div className="form-group">
                      <label htmlFor="email">
                        Sign up with your email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email address"
                        defaultValue={email}
                        onChange={this.handleOnChange}
                      />
                      {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <button onClick={this.checkEmail}>
                        REGISTER
                      </button>
                    </div>
                    <div className="form-group form-footer">
                      Already have an account? <Link to="/login">Login</Link>
                    </div>
                  </div>
                ) : (
                  <div className="step-2">
                    <div className="form-header">
                      <img src={arrow} alt="arrow" onClick={this.handleGoBack} /> Welcome to ClearTax GST
                    </div>
                    <div className="secondary-heading">
                      {email}
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={this.handleOnChange}
                        placeholder={flow === FLOW.LOGIN ? 'Password' : 'Create password'}
                      />
                      {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                      {
                        flow === FLOW.LOGIN ?
                        <button onClick={this.doLogin}>
                          LOGIN
                        </button>
                        : <button onClick={this.doSignup}>
                          REGISTER
                        </button>
                      }
                    </div>
                  </div>
                )
              }
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return { emailExistState: state.emailCheckResponse };
}

export default connect(state, {
  doLogin,
  doSignup,
  checkEmailExistenceAction,
})(NewSignup);
