import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class AddPhone extends Component {
       constructor(props){
           super(props);
           this.state = {
               model: "",
               brand: "",
               price: "",
               image: "",
               specs: ["", "", ""],
               isSubmitSuccessful: false,
           };
       } 

       // for all fields except images and specs
        genericSync(event) {
            const { name, value } = event.target;
            this.setState({ [name]: value });
        }

        uploadImage(event){
            // console.log("upload image: ", event.target.files);
            const { files } = event.target;    
            const uploadData = new FormData();

            uploadData.append("submittedFile", files[0]);

            axios.post(
                "http://localhost:3001/api/upload-file",
                uploadData,
                { withCredentials: true }
            )
            .then( response  => this.setState({ image:response.data.fileUrl }))
            .catch( err => console.log(err) );
        }

        syncSpec(event, index){
            const { specs } = this.state;
            // update the spec with whatever user typed in 
            // which means replace empty string with the value user typed in, on index 0, then 1, then 2, ...
            specs[index] = event.target.value;
            // update the state with the updated specs array
            this.setState({ specs });
        }

        handleSubmit(event){
            event.preventDefault();

            axios.post(
                "http://localhost:3001/api/phones",
                this.state,
                { withCredentials: true }
            )
            .then( response => {
                console.log("new phone: ", response.data);
                this.setState({ isSubmitSuccessful: true });
            } )
            .catch( err => console.log(err) );
        }


       render(){
            if(!this.props.currentUser){
                return <Redirect to="/login-page" />
            }

           if(this.state.isSubmitSuccessful){
               return <Redirect to="/phone-list" />
           }
           return(
               <section>
                   <h2> Add a phone </h2>
                   <form onSubmit={ e => this.handleSubmit(e) } >
                       <label> Model: </label>
                       <input 
                            value = { this.state.model }
                            onChange={ e => this.genericSync(e) }
                            type = "text"
                            name = "model"
                            placeholder = "iPhone X"
                        />

                        <label> Brand: </label>
                        <input 
                            value = { this.state.brand }
                            onChange={ e => this.genericSync(e) }
                            type = "text"
                            name = "brand"
                            placeholder = "Apple"
                        />

                        <label> Price: </label>
                        <input 
                            value = { this.state.price }
                            onChange={ e => this.genericSync(e) }
                            type = "number"
                            name = "price"
                            placeholder = "599.99"
                        />

                        <label> Image: </label>
                        <input 
                            onChange={ e => this.uploadImage(e) }
                            type= "file"
                        />
                        <br />
                        <img width="200"  src={ this.state.image }  />
                        <br />
                        <label> Specs </label>
                        <br />
                        <small> has to be 3 letters at least </small>
                        <br />

                        { this.state.specs.map((oneSpec, index) => {
                            return (
                                <input 
                                    key = {index}
                                    type = "text"
                                    value = { oneSpec }
                                    onChange = { e => this.syncSpec(e, index) }
                                />
                            );
                        } ) }

                        <button> Save </button>

                   </form>
               </section>
           )
       }

}


export default AddPhone;