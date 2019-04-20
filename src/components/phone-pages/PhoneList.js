import React, { Component } from "react";
import axios from "axios";


class PhoneList extends Component {
    constructor(props){
        super(props);
        this.state = {
            // the array stays empty until the response from server doesn't fill it
            phonesArray: [],
        };
    }

    componentDidMount(){
        axios.get(
            "http://localhost:3001/api/phones",
            { withCredentials: true }
        )
        .then( responseFromAPI => this.setState({ phonesArray: responseFromAPI.data }) )
        .catch( err => console.log(err) );
    }

    render(){
        // console.log('array of phones: ', this.state.phonesArray);
        const { phonesArray } = this.state;
        return (
            <section>
                <h1> Phones 📞 ☎️ </h1>
                { phonesArray.map(onePhone => {
                    return (
                        <li key={ onePhone._id }>
                            { onePhone.model } by { onePhone.brand }
                            <p> $ { onePhone.price } </p>
                            <img  width="100" src={ onePhone.image } alt={ onePhone.model }/>
                        </li>
                    )
                })}
            </section>
        )
    }
}

export default PhoneList;