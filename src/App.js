/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import Books from './components/list-books/list-books';
import NavBar from './components/nav-bar/nav-bar';
import {withRouter} from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props); 

    this.handleSelected = this.handleSelected.bind(this);
  }

  componentDidMount(){
    
    if(localStorage.getItem('auth-token')){
      
      fetch('http://localhost:8080/v2/book/', {
  
        method: 'GET',
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('auth-token')),
          'Content-Type': ' application/json'
        },
      }).then(res => {
        return res.json();
      })
        .then(listBooks => {
          console.log(listBooks);
          this.props.onGetBooks(listBooks);
          console.log(listBooks);
        }).catch(err => {
          this.props.history.push('/');
          console.log(err);
        });
    }
    else{
      this.props.history.push('/');
    }
  }

  handleSelected() {
    
    this.props.history.push('/newBook');
  }
  

  render() {
    console.log(this.props.listBooks);
    return (
      <div className="App">
        <div>
          <NavBar/>
        </div>
        <main className="App-header">
        
          <button className="App-button" onClick={() => { this.handleSelected(); }}>Add book</button>

        </main>
        <div>
          {this.props.listBooks.map(Book => <Books key={Book.id} id={Book.id}
            ind={this.props.listBooks.indexOf(Book)} book={Book} />)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listBooks: state.listBooks,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onGetBooks: (listBooks) => {
      dispatch({ type: 'GET_BOOKS' , listBooks});
    },
    onRenewToken: () => {
      dispatch({ type: 'RENEW_TOKEN'});
      
    }
  };
};



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
