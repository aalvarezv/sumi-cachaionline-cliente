import React, { useEffect, useState } from "react"
import { PieChart, Pie, Legend, Cell, ResponsiveContainer, Tooltip } from "recharts"
import clienteAxios from "../../config/axios"
import { handleError } from "../../helpers"


const ChartPieCuestionarioPromedioGeneral = ({codigo_cuestionario}) => {

    const [promedioGeneral, setPromedioGeneral] = useState([])

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getPromedioGeneral()
        }
    }, [codigo_cuestionario])

    const getPromedioGeneral = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/promedio-general', {
                params: {
                    codigo_cuestionario,
                }
            })
            console.log(resp.data.promedioGeneral)
            const { total_respuestas, correctas_cant, correctas_porcent, 
                    incorrectas_cant, incorrectas_porcent, 
                    omitidas_cant, omitidas_porcent } = resp.data.promedioGeneral

            setPromedioGeneral([
              {name: `De un total de ${total_respuestas} respuestas, ${correctas_cant === 1 ? '1 fue correcta' : `${correctas_cant} fueron correctas`}`, value: Number(correctas_porcent)},
              {name:`De un total de ${total_respuestas} respuestas, ${incorrectas_cant === 1 ? '1 fue incorrecta': `${incorrectas_cant} fueron incorrectas`}`, value: Number(incorrectas_porcent)},
              {name: `De un total de ${total_respuestas} respuestas, ${omitidas_cant === 1 ? '1 fue omitida' : `${omitidas_cant} fueron omitidas`}`, value: Number(omitidas_porcent)}
            ])

        } catch (e) {
            handleError(e)
        }

    }

    const COLORS = ['#28B463', '#E74C3C', '#F7DC6F']  

    return (  
        <>
          <h6 className="font-weight-bold text-muted mt-4">Promedio general cuestionario</h6>
          <ResponsiveContainer height={200} width="50%"> 
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={promedioGeneral}
                innerRadius={20}
                outerRadius={70} 
                startAngle={90} 
                endAngle={450} 
                fill="#8884d8"
                label
              >
                {promedioGeneral.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </>
    )
}
 
export default ChartPieCuestionarioPromedioGeneral