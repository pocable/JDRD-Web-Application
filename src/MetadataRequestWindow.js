import React from 'react';
import {Modal, Button, Form} from 'react-bootstrap';

/**
 * Props:
 * downloadWithMeta: function which takes in
 * cancelModel: When the cancel button is hit, return.
 */

export default class MetadataRequestWindow extends React.Component{

    state = {'seriesCheckbox': 'on', 'seasonCheckbox': 'off', 'seasonNumber': '', 'showName': ''}
    constructor(props){
        super(props);
        this.submit = this.submit.bind(this);
        this.toggleSeasonCheckbox = this.toggleSeasonCheckbox.bind(this);
        this.toggleSeriesCheckbox = this.toggleSeriesCheckbox.bind(this);
        this.updateSeasonText = this.updateSeasonText.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.updateShowName = this.updateShowName.bind(this);

    }

    submit(){
        this.props.downloadWithMeta(this.state.showName, this.state.seasonNumber);
    }

    toggleSeriesCheckbox(event){
        this.setState({'seriesCheckbox': 'on', 'seasonCheckbox': 'off'});
    }

    toggleSeasonCheckbox(event){
        this.setState({'seasonCheckbox': 'on', 'seriesCheckbox': 'off'});
    }

    updateSeasonText(event){
        this.setState({'seasonNumber': event.target.value})
    }

    updateShowName(event){
        this.setState({'showName': event.target.value})
    }
    cancelModal(){
        this.props.cancelModal()
    }


    render(){
        return (
        <>
            <Modal show={true} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Metadata Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.submit}>
                        <Form.Label>Additional metadata is required for TV shows.</Form.Label>
                        <Form.Group controlId="basicSearch">
                            <Form.Label>Enter Show Name: </Form.Label>
                            <Form.Control plaintext autoComplete="off" value={this.state.showName} onChange={this.updateShowName} placeholder="Stargate SG1, Stargate Atlantis, ..." />
                        </Form.Group>
                        <fieldset>
                            <Form.Group>
                                <Form.Check inline type="radio" name="formHor" onChange={this.toggleSeriesCheckbox} defaultChecked label="Entire Series Pack" />
                                <Form.Check inline type="radio" name="formHor" onChange={this.toggleSeasonCheckbox} label="Season Pack" />
                            </Form.Group>
                        </fieldset>
                        {this.state.seasonCheckbox === 'on' &&
                            <Form.Group controlId="basicSearch">
                                <Form.Label>Enter Season Number/Name: </Form.Label>
                                <Form.Control plaintext autoComplete="off" value={this.state.seasonNumber} onChange={this.updateSeasonText} placeholder="S01, S02, ..." />
                            </Form.Group>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.submit}>Submit</Button>
                    <Button variant="secondary" onClick={this.cancelModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
        );
    }
}
