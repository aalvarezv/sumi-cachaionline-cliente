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
            const { correctas_cant, correctas_porcent, 
                    incorrectas_cant, incorrectas_porcent, 
                    omitidas_cant, omitidas_porcent } = resp.data.promedioGeneral

            setPromedioGeneral([
              {name: `${correctas_cant} correctas`, value: Number(correctas_porcent)},
              {name:`${incorrectas_cant} incorrectas`, value: Number(incorrectas_porcent)},
              {name: `${omitidas_cant} omitidas`, value: Number(omitidas_porcent)}
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