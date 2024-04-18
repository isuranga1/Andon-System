import React, { useState } from 'react';
import styles from './App.module.scss';
import Classnames from 'classnames';

interface Record {
    status: string;
    mancalldesc: string;
    mancallto: string;
}

function App() {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showManCall, setShowManCall] = useState(false);
    const [showManCon, setShowManCon] = useState(false);
    const [showManDept, setShowManDept] = useState(false);

    const toggleDashboardVisibility = () => {
        setShowDashboard(true);
        setShowManCall(false);
        setShowManCon(false);
        setShowManDept(false);
    };

    const toggleManCallVisibility = () => {
        setShowDashboard(false);
        setShowManCall(true);
        setShowManCon(false);
        setShowManDept(false);
    };

    const toggleManConVisibility = () => {
        setShowDashboard(false);
        setShowManCall(false);
        setShowManCon(true);
        setShowManDept(false);
    };

    const toggleManDeptVisibility = () => {
        setShowDashboard(false);
        setShowManCall(false);
        setShowManCon(false);
        setShowManDept(true);
    };

    const [records, setRecords] = useState<Record[]>([]);

    const [newRecord, setNewRecord] = useState<Record>({
        status: '',
        mancalldesc: '',
        mancallto: '',
    });

    const [showAddRecord, setShowAddRecord] = useState(false);

    const toggleAddRecord = () => {
        setNewRecord({ status: '', mancalldesc: '', mancallto: '' }); // Reset newRecord state
        setShowAddRecord(!showAddRecord);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRecord({ ...newRecord, [name]: value });
    };

    const handleAddRecord = () => {
        setRecords([...records, newRecord]);
        setNewRecord({ status: '', mancalldesc: '', mancallto: '' });
        toggleAddRecord();
    };

    const handleCancelAddRecord = () => {
        setNewRecord({ status: '', mancalldesc: '', mancallto: '' });
        toggleAddRecord();
    };

    const handleDeleteRecord = (index: number) => {
        const updatedRecords = [...records];
        updatedRecords.splice(index, 1); // Remove the record at the specified index
        setRecords(updatedRecords);
    };

    const [showEditRecord, setShowEditRecord] = useState(false);

    const toggleEditRecord = () => {
        setShowEditRecord(!showEditRecord);
    };

    const [editingRecord, setEditingRecord] = useState<Record | null>(null);
    const [editingRecordIndex, setEditingRecordIndex] = useState<number>(-1);

    const handleEditRecord = (index: number) => {
        setEditingRecord(records[index]);
        setEditingRecordIndex(index); // Remember the index of the record being edited
        toggleEditRecord();
    };

    const handleEditCancelRecord = () => {
        setEditingRecord(null);
        setEditingRecordIndex(-1);
        toggleEditRecord(); // Hide the edit form
    };

    const handleEditAddRecord = () => {
        if (editingRecord && editingRecordIndex !== -1) {
            // Remove the old record
            const updatedRecords = records.filter((record, index) => index !== editingRecordIndex);
            
            // Add the new record with updated details
            const newEditedRecord: Record = {
                status: newRecord.status !== '' ? newRecord.status : editingRecord.status,
                mancalldesc: newRecord.mancalldesc !== '' ? newRecord.mancalldesc : editingRecord.mancalldesc,
                mancallto: newRecord.mancallto !== '' ? newRecord.mancallto : editingRecord.mancallto,
            };
            
            setRecords([...updatedRecords, newEditedRecord]);
            setEditingRecord(null); // Clear the editing state
            setEditingRecordIndex(-1); // Reset the editing index
        }
        toggleEditRecord(); // Hide the edit form
    };
    










    return (
        <div className={styles.App}>
            <div className={styles.topbar}>
                <h1 className={styles.logotext}>ANDON</h1>
                <button className={styles.account}></button>
            </div>

            <div className={styles.navbar}>
                <button
                    className={Classnames(styles.dashbutt, {
                        [styles.navbutclicked]: showDashboard,
                    })}
                    onClick={toggleDashboardVisibility}
                >
                    <img src="/src/assets/dash.svg" alt="" className={styles.dashim} />
                </button>

                <button
                    className={Classnames(styles.conbutt, {
                        [styles.navbutclicked]: showManCon,
                    })}
                    onClick={toggleManConVisibility}
                >
                    <img src="/src/assets/machine.svg" alt="" className={styles.dashim} />
                </button>

                <button
                    className={Classnames(styles.callbutt, {
                        [styles.navbutclicked]: showManCall,
                    })}
                    onClick={toggleManCallVisibility}
                >
                    <img src="/src/assets/call.svg" alt="" className={styles.dashim} />
                </button>

                <button
                    className={Classnames(styles.deptbutt, {
                        [styles.navbutclicked]: showManDept,
                    })}
                    onClick={toggleManDeptVisibility}
                >
                    <img src="/src/assets/dept.svg" alt="" className={styles.dashim} />
                </button>
            </div>








            {showDashboard && (
                <div className={styles.dashboard}>
                    <h1 className={styles.boardname}>Dashboard</h1>
                    <div className={styles.graph}>
                        <h3 className={styles.cardtitle}>Daily Andon Calls </h3>
                    </div>
                    <div className={styles.stats}>
                        <h3 className={styles.cardtitle}>Stats</h3>
                        <div className={styles.statgrid}>
                            <h1 className={styles.statname}>Downtime for the day</h1>
                            <h1 className={styles.statnum}>02:10:00 </h1>
                            <h1 className={styles.statname}>Average Rise time</h1>
                            <h1 className={styles.statbad}>12:25 </h1>
                            <h1 className={styles.statname}>Anomalies</h1>
                            <h1 className={styles.statnum}>None</h1>
                            <h1 className={styles.statname}>Anomalies</h1>
                            <h1 className={styles.statnum}>None</h1>
                            <h1 className={styles.statname}>Anomalies</h1>
                            <h1 className={styles.statnum}>None</h1>
                        </div>
                    </div>
                    <div className={styles.currentcalls}>
                        <h3 className={styles.cardtitle}>Current Andon Calls</h3>
                        <div className={styles.calls}>
                            <div className={styles.callsat}>
                                <div className={styles.callsatleft}>
                                    <h1 className={styles.machinenum}>MA00251</h1>
                                    <h3 className={styles.department}>Sewing Department</h3>
                                    <h2 className={styles.calltotext}>Andon Call to</h2>
                                    <h3 className={styles.callto}>CNC Tech</h3>
                                </div>
                                <div className={styles.callsatright}>
                                    <div className={styles.timeblock}>
                                        <h1 className={styles.time}>08:29</h1>
                                        <div className={styles.status} />
                                    </div>
                                    <h1 className={styles.attended}>Not Attended Yet</h1>
                                </div>
                            </div>
                            <div className={styles.att}>
                                <div className={styles.callsatleft}>
                                    <h1 className={styles.machinenum}>MA00251</h1>
                                    <h3 className={styles.department}>Sewing Department</h3>
                                </div>
                                <div className={styles.callsatright}>
                                    <div className={styles.timeblock}>
                                        <h1 className={styles.time}>08:29</h1>
                                        <div className={styles.status} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.att}>
                                <div className={styles.callsatleft}>
                                    <h1 className={styles.machinenum}>MA00251</h1>
                                    <h3 className={styles.department}>Sewing Department</h3>
                                </div>
                                <div className={styles.callsatright}>
                                    <div className={styles.timeblock}>
                                        <h1 className={styles.time}>08:29</h1>
                                        <div className={styles.status} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.att}>
                                <div className={styles.callsatleft}>
                                    <h1 className={styles.machinenum}>MA00251</h1>
                                    <h3 className={styles.department}>Sewing Department</h3>
                                </div>
                                <div className={styles.callsatright}>
                                    <div className={styles.timeblock}>
                                        <h1 className={styles.time}>08:29</h1>
                                        <div className={styles.status} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.att}>
                                <div className={styles.callsatleft}>
                                    <h1 className={styles.machinenum}>MA00251</h1>
                                    <h3 className={styles.department}>Sewing Department</h3>
                                </div>
                                <div className={styles.callsatright}>
                                    <div className={styles.timeblock}>
                                        <h1 className={styles.time}>08:29</h1>
                                        <div className={styles.status} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}








            {showManCall && (
                <div className={styles.managecalls}>
                    <h1 className={styles.boardname}>Manage Calls</h1>

                    <div className={styles.coltitle}>
                        <h1 className={styles.coltitletext}>Color</h1>
                        <h1 className={styles.coltitletext}>Description </h1>
                        <div></div>
                        <h1 className={styles.coltitletext}>Call To</h1>
                    </div>

                    {records.map((record, index) => (
                        <div key={index}>
                        {index !== editingRecordIndex && (
                            <div className={styles.managecallcard}>
                                <div className={styles.coltitle}>
                                    <h1 className={Classnames(styles.cardtext, styles.stattmp)}>
                                        {record.status}
                                    </h1>
                                    <h1 className={Classnames(styles.cardtext, styles.mancalldesc)}>
                                        {record.mancalldesc}
                                    </h1>
                                    <h1 className={Classnames(styles.cardtext, styles.mancallto)}>
                                        {record.mancallto}
                                    </h1>
                                    <div className={styles.mancallbut}>
                                        <button className={styles.mancalldel} onClick={() => handleEditRecord(index)}>
                                            <img
                                                src="/src/assets/edit.svg"
                                                alt=""
                                                className={styles.editsvg}
                                            />
                                        </button>
                                        <button className={styles.mancalledit} onClick={() => handleDeleteRecord(index)}>
                                            <img
                                                src="/src/assets/del.svg"
                                                alt=""
                                                className={styles.editsvg}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}

                    {showAddRecord && (
                        <div className={Classnames(styles.managecallcard, styles.cardedit)}>
                            <h1 className={styles.cardedittitle}>Add Call</h1>
                            <div className={styles.coltitle}>
                                <select
                                    name      = "status" 
                                    className = {styles.colorlist}
                                    value     = {newRecord.status}
                                    onChange  = {handleInputChange}>
                                        <option value="" disabled selected>Color</option>
                                        <option value = "Red">Red </option>
                                        <option value = "Yellow">Yellow</option>
                                        <option value = "Green">Green</option>
                                        <option value = "Blue">Blue</option>
                                        <option value = "White">White</option>
                                </select>
                                <input 
                                    type = "text"
                                    name = "mancalldesc"
                                    value = {newRecord.mancalldesc}
                                    onChange = {handleInputChange}
                                    placeholder="Description" 
                                    className={styles.mancalldescin}/>
                                <input
                                    type = "text"
                                    name = "mancallto"
                                    value = {newRecord.mancallto}
                                    onChange = {handleInputChange}
                                    placeholder="Call to"
                                    className={styles.mancalltoin}/>

                                <div className={styles.mancallbut}>
                                    <button className={styles.mancalldel} onClick={handleAddRecord}>
                                        <img
                                            src="/src/assets/check.svg"
                                            alt=""
                                            className={styles.editsvg}
                                        />
                                    </button>
                                    <button className={styles.mancalledit} onClick={handleCancelAddRecord}>
                                        <img
                                            src="/src/assets/close.svg"
                                            alt=""
                                            className={styles.editsvg}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {editingRecord && (
                        <div className={Classnames(styles.managecallcard, styles.cardedit)}>
                            <h1 className={styles.cardedittitle}>Edit Call</h1>
                            <div className={styles.coltitle}>
                                <select
                                    name      = "status" 
                                    className = {styles.colorlist}
                                    value     = {newRecord.status}
                                    onChange  = {handleInputChange}>
                                        <option value="" disabled selected>{editingRecord ? editingRecord.status : ""}</option>
                                        <option value = "Red">Red </option>
                                        <option value = "Yellow">Yellow</option>
                                        <option value = "Green">Green</option>
                                        <option value = "Blue">Blue</option>
                                        <option value = "White">White</option>
                                </select>
                                <input 
                                    type = "text"
                                    name = "mancalldesc"
                                    value = {newRecord.mancalldesc}
                                    onChange = {handleInputChange}
                                    placeholder= {editingRecord ? editingRecord.mancalldesc : "Description"}
                                    className={styles.mancalldescin}/>
                                <input
                                    type = "text"
                                    name = "mancallto"
                                    value = {newRecord.mancallto}
                                    onChange = {handleInputChange}
                                    placeholder= {editingRecord ? editingRecord.mancallto : "Call to"}
                                    className={styles.mancalltoin}/>

                                <div className={styles.mancallbut}>
                                    <button className={styles.mancalldel} onClick={handleEditAddRecord}>
                                        <img
                                            src="/src/assets/check.svg"
                                            alt=""
                                            className={styles.editsvg}
                                        />
                                    </button>
                                    <button className={styles.mancalledit} onClick={handleEditCancelRecord}>
                                        <img
                                            src="/src/assets/close.svg"
                                            alt=""
                                            className={styles.editsvg}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showAddRecord && !editingRecord && (
                        <button className={styles.addbutton} onClick={toggleAddRecord}>Add Calls +</button>
                    )}
                </div>
            )}








            {showManCon && (
                <div className={styles.manageconsoles}>
                    <h1 className={styles.boardname}>Manage Consoles</h1>
                    <div className={styles.coltitle}>
                        <h1 className={styles.coltitletext}>Machine</h1>
                        <h1 className={styles.coltitletext}>Department</h1>
                        <div></div>
                        <h1 className={styles.coltitletext}>Console ID</h1>
                        <h1 className={styles.coltitletext}>Calls</h1>
                    </div>
                    <div className={Classnames(styles.managecallcard, styles.con)}>
                        <div className={styles.coltitle}>
                            <h1 className={Classnames(styles.cardtext, styles.machineno)}>
                                MA00251
                            </h1>
                            <h1 className={Classnames(styles.cardtext, styles.deptcon)}>
                                Sewing Department
                            </h1>
                            <h1 className={Classnames(styles.cardtext, styles.conid)}>
                                1025668314
                            </h1>
                            <div className={styles.concalls}>
                                <div className={styles.callgrid}>
                                    <div className={Classnames(styles.st1, styles.call1)} />
                                    <div className={Classnames(styles.st1, styles.call2)} />
                                    <div className={Classnames(styles.st1, styles.call3)} />
                                </div>
                            </div>
                            <div className={styles.mancallbut}>
                                <button className={styles.mancalldel}>
                                    <img
                                        src="/src/assets/edit.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                                <button className={styles.mancalledit}>
                                    <img
                                        src="/src/assets/del.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={Classnames(styles.managecallcard, styles.con)}>
                        <div className={styles.coltitle}>
                            <h1 className={Classnames(styles.cardtext, styles.machineno)}>
                                MA00251
                            </h1>
                            <h1 className={Classnames(styles.cardtext, styles.deptcon)}>
                                Sewing Department
                            </h1>
                            <h1 className={Classnames(styles.cardtext, styles.conid)}>
                                1025668314
                            </h1>
                            <div className={styles.concalls}>
                                <div className={styles.callgrid}>
                                    <div className={Classnames(styles.st1, styles.call1)} />
                                    <div className={Classnames(styles.st1, styles.call2)} />
                                    <div className={Classnames(styles.st1, styles.call3)} />
                                </div>
                            </div>
                            <div className={styles.mancallbut}>
                                <button className={styles.mancalldel}>
                                    <img
                                        src="/src/assets/edit.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                                <button className={styles.mancalledit}>
                                    <img
                                        src="/src/assets/del.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={Classnames(styles.managecallcard, styles.con, styles.edit2)}>
                        <h1 className={styles.cardedittitle}>Edit </h1>
                        <h1 className={styles.button2txt}>Heading 1</h1>
                        <div className={styles.coltitle}>
                            <input className={styles.machinein} />
                            <input className={styles.deptin} />
                            <input className={styles.conin} />
                            <div className={styles.selcalls}>
                                <select className={styles.col1}>
                                    <option>Apple</option>
                                    <option>Banana</option>
                                    <option>Watermelon</option>
                                </select>
                                <h1 className={styles.button1txt}>Heading 1</h1>
                                <select className={styles.col1}>
                                    <option>Apple</option>
                                    <option>Banana</option>
                                    <option>Watermelon</option>
                                </select>
                                <h1 className={styles.button1txt}>Heading 1</h1>
                                <select className={styles.col1}>
                                    <option>Apple</option>
                                    <option>Banana</option>
                                    <option>Watermelon</option>
                                </select>
                            </div>
                            <div className={styles.mancallbut}>
                                <button className={styles.mancalldel}>
                                    <img
                                        src="/src/assets/check.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                                <button className={styles.mancalledit}>
                                    <img
                                        src="/src/assets/close.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className={styles.addbutton}>Add Consoles +</button>
                </div>
            )}








            {showManDept && (
                <div className={styles.managedepts}>
                    <h1 className={styles.boardname}>Manage Departments </h1>
                    <div className={styles.coltitle}>
                        <h1 className={styles.coltitletext}>Name</h1>
                    </div>
                    <div className={Classnames(styles.managecallcard, styles.dep1)}>
                        <div className={styles.coltitle}>
                            <h1 className={Classnames(styles.cardtext, styles.deptname)}>
                                Heading 1
                            </h1>
                            <div className={styles.mancallbut}>
                                <button className={styles.mancalldel}>
                                    <img
                                        src="/src/assets/edit.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                                <button className={styles.mancalledit}>
                                    <img
                                        src="/src/assets/del.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className={Classnames(styles.managecallcard, styles.cardedit, styles.dep2)}
                    >
                        <h1 className={styles.cardedittitle}>Edit </h1>
                        <div className={styles.coltitle}>
                            <input className={styles.deptnamein} />
                            <div className={styles.mancallbut}>
                                <button className={styles.mancalldel}>
                                    <img
                                        src="/src/assets/check.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                                <button className={styles.mancalledit}>
                                    <img
                                        src="/src/assets/close.svg"
                                        alt=""
                                        className={styles.editsvg}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className={styles.addbutton}>Add Departments +</button>
                </div>
            )}
        </div>
    );
}

export default App;