import React from 'react';
import { DragItem, Drag } from '../components/Drag';

export default function Test() {
    return <Drag
        onChange={(e) => {
            console.log(e);
        }}
        onDrop={(e) => {
            console.log(e);
        }}
    >
        <DragItem htmlType="div">
            <div className="flex">
                <DragItem>
                    <div>flex1</div>
                </DragItem>
                <DragItem>
                    <div>flex2</div>
                </DragItem>
                <DragItem>
                    <div>flex3</div>
                </DragItem>
            </div>
            <DragItem>
                <div style={{ marginTop: 10 }}>asf</div>
            </DragItem>

            <DragItem>
                <div>asf234</div>
            </DragItem>

            <DragItem>
                <div>ppasdf9080s</div>
            </DragItem>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <DragItem>
                <div>far</div>
            </DragItem>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
            <p>br</p>
        </DragItem>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
        <p>br</p>
    </Drag>;
}