import React from 'react'
import { useTable, useSortBy, useExpanded } from "react-table";
import SampleData from "./Data";
import Averages from './Average';
import TeamTable from "./TeamTable";
import TestTable from './Test';

const SummaryTable = (props) => {


    const getTeams = () => {
        /*let list = data.map( (o) => {
                return o.TeamNumber;
        });

        let finList = [];
        
        list.forEach(element => {
            if (finList.includes(element) === false){
                finList.push(element)
            }
        });

        return finList;
        */

        /*try{
            const dat = await fetch('https://www.thebluealliance.com/api/v3/event/2022hiho/teams', { mode: "cors", headers: { 'X-TBA-Auth-Key': 'B9xCtlRyJheUGvzJShpl1QkOor35UTPO8GUtpn7Uq9xB5aJQL44yNzXnTZBHpWXz' } })
            if(!dat.ok){
                throw new Error(
                    'Error ' + dat.status
                );
            }
            let actual = await dat.json();
            setData(actual);
        }
        catch (err){
            setData(null);
        }*/

        const teamObject = {
            TeamNumber: 0,
            Strategy: '',
            AveragePoints: 0,
            AverageLowHubShots: 0,
            AverageLowHubAccuracy: 0,
            AverageUpperHubShots: 0,
            AverageUpperHubAccuracy: 0,
            AverageHangar: 0,
        }

        let list = [];

        fetch('https://www.thebluealliance.com/api/v3/event/2022hiho/teams', { mode: "cors", headers: { 'X-TBA-Auth-Key': 'B9xCtlRyJheUGvzJShpl1QkOor35UTPO8GUtpn7Uq9xB5aJQL44yNzXnTZBHpWXz' } })
            .then(response => response.json())
            .catch(err => console.log(err))
            .then(data => {
                data.map(obj => {
                    let teamAverages = Object.create(teamObject);
                    teamAverages.TeamNumber = obj.team_number;
                    list.push(teamAverages);
                });
            })

        return list;
    }

    const tData = getTeams();
    console.log(tData)

    const data = SampleData();

    

    const getTeamInfo = (cell) => { // get objects of certain team number
        let info = data.filter((x) => x.TeamNumber === cell.value)
        console.log(info)
        return info;
    }


    const columns = React.useMemo(
        () => [
            { id:'exp',
                Header: () => null,
                accessor: 'TeamNumber',
                Cell: ({row}) => 
                   (
                        <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '-' : '+'}
                        </span>
                    ),
            },
            {
                Header: 'Team #',
                accessor: 'TeamNumber'
            },  
            {
                Header: 'Priority / Strategy',
                accessor: 'Strategy'
            },
            {
                Header: 'Average Points',
                accessor: 'averagePoints',
            },
            {
                Header: 'Average Low Hub',
                accessor: 'averageLowHub',
            },
            {
                Header: 'Average Low Hub Accuracy',
                accessor: 'averageLowAccuracy',
            },
            {
                Header: 'Average Upper Hub',
                accessor: 'averageUpperHub',
            },
            {
                Header: 'Average Upper Hub Accuracy',
                accessor: 'averageUpperAccuracy',
            },
            {
                Header: 'Average Hangar Points',
                accessor: 'averageHangar',
            },
        ],
        []
    )

    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
          <pre>
            <div>{<TestTable information={data} />} {<TeamTable/>} </div>
          </pre>
        ),
        []
      )

    const tableInstance = useTable({ columns, data }, useSortBy, useExpanded);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
    } = tableInstance


    return (
        <div>
            <table {...getTableProps()} >

                <thead>
                    {
                        headerGroups.map(headerGroup =>
                        (
                            <tr {...headerGroup.getHeaderGroupProps()} >
                                {
                                    headerGroup.headers.map(column =>
                                    (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={{
                                                padding: '10px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {column.render('Header')}
                                        </th>
                                    )
                                    )
                                }
                            </tr>
                        )
                        )
                    }
                </thead>

                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
                            prepareRow(row)

                            return ( <React.Fragment  >
                                
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {
                                            return (
                                                <td
                                                    onClick = {() => {
                                                        getTeamInfo(cell)
                                                    }}
                                                    {...cell.getCellProps()}
                                                    style={{
                                                        padding: '10px',
                                                        border: 'solid 1px black',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {cell.render('Cell')}

                                                </td>
                                            )
                                        }
                                        )
                                    }
                                </tr>

                                {row.isExpanded ? (
                                    <tr>
                                        <td colSpan={visibleColumns.length}>
                                            {renderRowSubComponent({ row })}
                                        </td>
                                    </tr>
                                ) : null}

                                
                                </React.Fragment>
                            )
                        }
                        )
                    }
                </tbody>

            </table>

        </div>
    )

}

export default SummaryTable;