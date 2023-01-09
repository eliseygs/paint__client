import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss"
import Brush from "../tools/Brush";
import {Button, Modal} from 'react-bootstrap'
import {useParams} from 'react-router-dom'
const Canvas = observer(() => {
    const canvasRef= useRef()
    const usernameRef =useRef()
    const [modal, setModal] = useState(true)
    const params= useParams()
    useEffect(() => {
        // console.log(canvasRef.current)
        canvasState.setCanvas(canvasRef.current)
    }, [])

    useEffect(() => {
        if(canvasState.username){
          const socket= new WebSocket('ws://localhost:5000/')
          canvasState.setSocket(socket)
          canvasState.setSessionId(params.id)
          toolState.setTool(new Brush(canvasRef.current, socket, params.id))
          socket.onopen= () => {
          socket.send(JSON.stringify({
            id:params.id,
            username: canvasState.username,
            method:"connection"
          })) 
        }
        socket.onmessage = (event) => {
          let msg= JSON.parse(event.data)
          switch (msg.method){
            case 'connection':
              console.log(`user ${msg.username} connect`)
            case "draw":
              drawHandler(msg)
              break
          }
          console.log(msg)
        }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
      const figure= msg.figure
      const ctx= canvasRef.current.getContext('2d')
      switch(figure.type){
        case "brush":
          Brush.draw(ctx, figure.x, figure.y)
          break
        case "finish":
          ctx.beginPath()
          break
      }

    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }
    const connectHandler = () => {
      canvasState.setUsername(usernameRef.current.value)
      setModal(false)
    }
    return (
        <div className="canvas">
             <Modal show={modal} onHide={()=>{}}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            in
          </Button>
        </Modal.Footer>
      </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={500} height={400}/>
        </div>
    )
})

export default Canvas;