import React from 'react';
import PropTypes from 'prop-types'
import {Modal, Button, Form} from 'react-bootstrap';

/**
  * Window popup form to request TV show metadata.
  */
export default class MetadataRequestWindow extends React.Component{

    state = {'seriesCheckbox': 'on', 'seasonCheckbox': 'off', 'seasonNumber': '', 'showName': ''}

    static propTypes = {

        /** 
         * Function called with showName and seasonNumber as parameters. 
         * 
         * @param {string} showName The TV show name grabbed.
         * @param {string} seasonNumber The TV show season number 
         */
        downloadWithMeta: PropTypes.func,

        /** Function called when the request window is closed. */
        cancelModal: PropTypes.func
    }

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

    toggleSeriesCheckbox(){
        this.setState({'seriesCheckbox': 'on', 'seasonCheckbox': 'off'});
    }

    toggleSeasonCheckbox(){
        this.setState({'seasonCheckbox': 'on', 'seriesCheckbox': 'off'});
    }

    updateSeasonText(event){
        this.setState({'seasonNumber': event.target.value})
    }

    updateShowName(event){
        this.setState({'showName': event.target.value})
    }

    /**
     * Called when the cancel button is called, will tell parent to not render
     * this anymore.
     */
    cancelModal(){
        this.props.cancelModal()
    }


    render(){
        return (
            <>
                <Modal show={true} onHide={this.cancelModal}>
                    <Modal.Header>
                        <Modal.Title>Metadata Required</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.submit}>
                            <Form.Label>Additional metadata is required for TV shows.</Form.Label>
                            <Form.Group controlId="basicSearch">
                                <Form.Label>Enter Show Name: </Form.Label>
                                <input plaintext name="showName" type="text" className="form-control" placeholder="Stargate SG1, Stargate Atlantis, ..." autoComplete="off" value={this.state.showName} onChange={this.updateShowName}/>
                            </Form.Group>
                            <fieldset>
                                <Form.Group>
                                    <Form.Check inline type="radio" name="formHor" onChange={this.toggleSeriesCheckbox} defaultChecked label="Multiple Seasons" />
                                    <Form.Check inline type="radio" name="formHor" onChange={this.toggleSeasonCheckbox} label="Specific Season" />
                                </Form.Group>
                            </fieldset>
                            {this.state.seasonCheckbox === 'on' &&
                                <Form.Group controlId="basicSearch">
                                    <Form.Label>Enter Season Number/Name: </Form.Label>
                                    <input name="seasonNumber" type="text" className="form-control" plaintext autoComplete="off" value={this.state.seasonNumber} onChange={this.updateSeasonText} placeholder="S01, S02, ..."/>
                                </Form.Group>
                            }
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={this.submit}>Download</Button>
                        <Button variant="danger" onClick={this.cancelModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
