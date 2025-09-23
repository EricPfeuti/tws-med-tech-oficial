import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function PatientEvents(){
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [show, setShow] = useState(false);
    
    useEffect(() => {

        api.get("/calendar/patient")
            .then((res) => setEvents(res.data))
            .catch((err) => console.error("Erro ao carregar eventos:", err))

    }, []);

    const handleClose = () => {
        setShow(false);
        setSelectedEvent(true);
    }

    const handleShow = (event) => {
        setSelectedEvent(event);
        setShow(true);
    } 

    return (
        <div>
            <h2>📌 Eventos do Médico</h2>
            <div className="list-group">
                {events.map((ev) => (
                    <button key={ev._id} onClick={() => handleShow(ev)}>{ev.title} - {ev.date} {ev.time}</button>
                ))}
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEvent?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Descrição:</strong> {selectedEvent?.description}</p>
                    <p><strong>Data:</strong> {selectedEvent?.date}</p>
                    <p><strong>Hora:</strong> {selectedEvent?.time}</p>
                    <p><strong>Participantes:</strong> {selectedEvent?.attendes?.join(", ")}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}