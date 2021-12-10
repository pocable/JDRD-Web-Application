import React from 'react';
import PropTypes from 'prop-types'
import {Modal, Button, Form} from 'react-bootstrap';

/**
  * Window popup form to request TV show metadata.
  */
export default class DownloadConfirmation extends React.Component{

    static propTypes = {

        /** Function called when the request window is closed. */
        cancelModal: PropTypes.func,

        /** If the user wants to edit movie metadata information. */
        isTV: PropTypes.bool,

        /** Default autofill information for the metadata. */
        season: PropTypes.number,
        title: PropTypes.string,
        year: PropTypes.number,

        /** Media path */
        path: PropTypes.string
    }

    constructor(props){
        super(props);
        this.state = {seriesCheckbox: (this.props.season) ? 'off' : 'on', seasonCheckbox: (this.props.season) ? 'on' : 'off', season: this.props.season,
         title: this.props.title, year: this.props.year}
        this.submit = this.submit.bind(this);
        this.toggleSeasonCheckbox = this.toggleSeasonCheckbox.bind(this);
        this.toggleSeriesCheckbox = this.toggleSeriesCheckbox.bind(this);
        this.updateSeasonText = this.updateSeasonText.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateYear = this.updateYear.bind(this);
        this.buildDownloadLocation = this.buildDownloadLocation.bind(this);
    }

    submit(){
        let dlLoc = this.buildDownloadLocation();
        if(dlLoc !== undefined){
            this.props.download(dlLoc)
        }
    }

    toggleSeriesCheckbox(){
        this.setState({'seriesCheckbox': 'on', 'seasonCheckbox': 'off'});
    }

    toggleSeasonCheckbox(){
        this.setState({'seasonCheckbox': 'on', 'seriesCheckbox': 'off'});
    }

    updateSeasonText(event){
        this.setState({'season': event.target.value})
    }

    updateTitle(event){
        this.setState({'title': event.target.value})
    }

    updateYear(event){
        this.setState({'year': event.target.value})
    }

    /**
     * Build the download location given the state
     * @returns The path to build to, or undefined
     */
    buildDownloadLocation(){
        if(this.state.title){
            if(this.props.isTV){
                let tvPath = this.props.path + 'tv/' + this.state.title
                if(this.state.year){
                    tvPath += " (" + this.state.year + ")"
                }
                tvPath += "/"

                if(this.state.season && this.state.seasonCheckbox === 'on'){
                    if(isNaN(this.state.season)){
                        tvPath += this.state.season + "/"
                    }else{
                        tvPath += "Season " + parseInt(this.state.season) + "/"
                    }
                }
                return tvPath

            }else{
                let moviePath = this.props.path + "movies/" + this.state.title
                if(this.state.year){
                    return moviePath + " (" + this.state.year + ")/"
                }else{
                    return moviePath + "/"
                }
            }
        }
        return undefined
    }

    /**
     * Called when the cancel button is called, will tell parent to not render
     * this anymore.
     */
    cancelModal(){
        this.props.cancelModal()
    }

    render(){
        let dlLoc = this.buildDownloadLocation()
        return (
            <>
                <Modal show={true} onHide={this.cancelModal}>
                    <Modal.Header>
                        <Modal.Title>Metadata Editor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.submit}>
                            <Form.Label>Additional metadata is used to sort Movies/TV into their proper folders.</Form.Label>
                            <Form.Group controlId="basicSearch">
                                <Form.Label>Enter Title: </Form.Label>
                                <input name="titleName" type="text" className="form-control" placeholder="Stargate SG1, Borat, ..." autoComplete="off" value={this.state.title} onChange={this.updateTitle}/>
                                <Form.Label>Enter Year: </Form.Label>
                                <input name="yearName" type="text" className="form-control" placeholder="2000, 2001, ..." autoComplete="off" value={this.state.year} onChange={this.updateYear}/>
                            </Form.Group>

                            {this.props.isTV &&
                                <fieldset>
                                    <Form.Group>
                                        <Form.Check inline type="radio" name="formHor" onChange={this.toggleSeriesCheckbox} defaultChecked={this.state.seasonCheckbox === 'off'} label="Multiple Seasons" />
                                        <Form.Check inline type="radio" name="formHor" onChange={this.toggleSeasonCheckbox} defaultChecked={this.state.seasonCheckbox === 'on'} label="Specific Season" />
                                    </Form.Group>
                                </fieldset>
                            }
                            {this.state.seasonCheckbox === 'on' &&
                                <Form.Group controlId="basicSearch">
                                    <Form.Label>Enter Season Number/Name: </Form.Label>
                                    <input name="seasonNumber" type="text" className="form-control" autoComplete="off" value={this.state.season} onChange={this.updateSeasonText} placeholder="1, 10, Extras, ..."/>
                                </Form.Group>
                            }
                            <Form.Label>{(dlLoc) ? "Download Location: " + dlLoc : "Missing required data."}</Form.Label>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={this.submit} disabled={(dlLoc) ? false : true}>Download</Button>
                        <Button variant="danger" onClick={this.cancelModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
