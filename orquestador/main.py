import os
import sys
import time
import argparse
from crewai import Crew, Process, Task
from agents.corporate_team import (
    ceo_agent,
    cto_agent,
    cco_agent,
    cfo_agent,
    coo_agent
)

ENTREGABLES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'entregables')
os.makedirs(ENTREGABLES_DIR, exist_ok=True)

def guardar_entregable(area: str, objetivo: str, resultado: str):
    """Guarda el resultado del agente en un archivo Markdown con timestamp."""
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    nombre_archivo = f"entregable_{area.lower().replace(' ', '_')}_{timestamp}.md"
    ruta_completa = os.path.join(ENTREGABLES_DIR, nombre_archivo)
    
    contenido = f"""# ENTREGABLE CORPORATIVO - {area.upper()}
**Corporación Syverluma S.A.C.**
**Fecha y Hora:** {time.strftime("%Y-%m-%d %H:%M:%S")}
**Misión Asignada:** {objetivo}

---

## Resultado y Directivas del Agente:

{resultado}

---
*Documento generado automáticamente por el Orquestador Multi-Agente de Syverluma.*
"""
    with open(ruta_completa, 'w', encoding='utf-8') as f:
        f.write(contenido)
    
    print(f"\n[OK] Entregable guardado físicamente en:\n  -> {ruta_completa}\n")
    return ruta_completa

# ==============================================================================
# 1. GERENCIA GENERAL (CEO)
# ==============================================================================
def ejecutar_mision_gerencia(objetivo: str):
    print(f"\n[SYVERLUMA - GERENCIA GENERAL] Despachando misión al CEO: '{objetivo}'\n")
    tarea = Task(
        description=f"""Como CEO de la Corporación Syverluma S.A.C., analiza la siguiente iniciativa y define la hoja de ruta estratégica:
{objetivo}

DIRECTRICES:
1. Mantén la visión de Syverluma como matriz que adopta y escala múltiples emprendimientos (eDark Store, Syverluma Gifts, y nuevos negocios).
2. Establece prioridades claras, impacto esperado y los roles de cada departamento para ejecutarlo.
3. Entrega un plan estratégico ejecutivo con acciones concretas.
""",
        expected_output="Plan estratégico ejecutivo con fases, prioridades y delegación a departamentos.",
        agent=ceo_agent
    )
    crew = Crew(agents=[ceo_agent], tasks=[tarea], process=Process.sequential, verbose=True)
    resultado = crew.kickoff()
    guardar_entregable("Gerencia_General_CEO", objetivo, str(resultado))
    return resultado

# ==============================================================================
# 2. TI Y SISTEMAS (CTO)
# ==============================================================================
def ejecutar_mision_ti(objetivo: str):
    print(f"\n[SYVERLUMA - TI Y SISTEMAS] Despachando misión al CTO: '{objetivo}'\n")
    tarea = Task(
        description=f"""Como CTO y Arquitecto de Software de Syverluma, implementa o especifica técnicamente la siguiente tarea en el monorepo:
{objetivo}

DIRECTRICES:
1. Revisa la arquitectura existente en 'backend/' (Django REST + Firestore) y 'frontend/' (Next.js 16 + Tailwind).
2. Respeta las directrices de DESIGN.md (cristal oscuro, rounded-2xl, acentos azul/esmeralda).
3. Cumple la Regla Verum: máxima protección de credenciales y variables de entorno (.env).
4. No elimines código preexistente sin justificación técnica.
""",
        expected_output="Código fuente modular o especificación técnica de arquitectura y endpoints.",
        agent=cto_agent
    )
    crew = Crew(agents=[cto_agent], tasks=[tarea], process=Process.sequential, verbose=True)
    resultado = crew.kickoff()
    guardar_entregable("TI_y_Sistemas_CTO", objetivo, str(resultado))
    return resultado

# ==============================================================================
# 3. VENTAS Y COMERCIAL (CCO)
# ==============================================================================
def ejecutar_mision_ventas(objetivo: str):
    print(f"\n[SYVERLUMA - VENTAS Y CRECIMIENTO] Despachando misión al CCO: '{objetivo}'\n")
    tarea = Task(
        description=f"""Como Director Comercial (CCO) de Syverluma, diseña la estrategia comercial para el siguiente objetivo:
{objetivo}

DIRECTRICES:
1. Diseña el embudo de captación o venta: propuesta de valor, mensajes de contacto y canales.
2. Si se trata de afiliar nuevos emprendimientos a la matriz, define el paquete de comisiones o suscripción.
3. Si se trata de eDark Store, enfócate en ofertas de tecnología, packs gaming y campañas B2B/B2C.
""",
        expected_output="Estrategia comercial detallada, embudo de conversión y guión de ventas.",
        agent=cco_agent
    )
    crew = Crew(agents=[cco_agent], tasks=[tarea], process=Process.sequential, verbose=True)
    resultado = crew.kickoff()
    guardar_entregable("Ventas_y_Comercial_CCO", objetivo, str(resultado))
    return resultado

# ==============================================================================
# 4. CONTABILIDAD Y FINANZAS (CFO)
# ==============================================================================
def ejecutar_mision_finanzas(objetivo: str):
    print(f"\n[SYVERLUMA - FINANZAS Y CONTABILIDAD] Despachando misión al CFO: '{objetivo}'\n")
    tarea = Task(
        description=f"""Como Director Financiero (CFO) de Syverluma, analiza la viabilidad económica y estructura de costos para:
{objetivo}

DIRECTRICES:
1. Estructura los costos asociados (infraestructura en Google Cloud, comisiones de pasarelas Culqi/Yape/MercadoPago, costos de producto).
2. Calcula márgenes de ganancia netos proyectados en Soles (S/) o USD.
3. Presenta un balance de viabilidad financiera con recomendaciones para maximizar el flujo de caja.
""",
        expected_output="Análisis financiero detallado con desglose de costos, márgenes netos y proyecciones.",
        agent=cfo_agent
    )
    crew = Crew(agents=[cfo_agent], tasks=[tarea], process=Process.sequential, verbose=True)
    resultado = crew.kickoff()
    guardar_entregable("Contabilidad_y_Finanzas_CFO", objetivo, str(resultado))
    return resultado

# ==============================================================================
# 5. ADMINISTRACIÓN Y OPERACIONES (COO)
# ==============================================================================
def ejecutar_mision_operaciones(objetivo: str):
    print(f"\n[SYVERLUMA - OPERACIONES Y ADMIN] Despachando misión al COO: '{objetivo}'\n")
    tarea = Task(
        description=f"""Como Director de Operaciones (COO) de Syverluma, elabora el protocolo operativo para:
{objetivo}

DIRECTRICES:
1. Redacta el procedimiento operativo estándar (SOP) paso a paso.
2. Si involucra pedidos, estandariza el flujo logístico (desde 'pendiente' hasta 'entregado').
3. Si involucra incorporación de emprendimientos, redacta el checklist de onboarding y políticas de calidad.
""",
        expected_output="Procedimiento operativo estándar (SOP) claro, checklist de cumplimiento y directivas.",
        agent=coo_agent
    )
    crew = Crew(agents=[coo_agent], tasks=[tarea], process=Process.sequential, verbose=True)
    resultado = crew.kickoff()
    guardar_entregable("Administracion_y_Operaciones_COO", objetivo, str(resultado))
    return resultado

# ==============================================================================
# 6. JUNTA DIRECTIVA COMPLETA (MESA EJECUTIVA MULTI-AGENTE)
# ==============================================================================
def ejecutar_mision_corporativa(objetivo_estrategico: str):
    print(f"\n[SYVERLUMA - JUNTA DIRECTIVA] Convocando a los 5 departamentos para: '{objetivo_estrategico}'\n")

    t_ceo = Task(
        description=f"Define la visión, objetivos y prioridades estratégicas para: {objetivo_estrategico}",
        expected_output="Directiva estratégica corporativa.",
        agent=ceo_agent
    )
    t_cto = Task(
        description="Evalúa el impacto técnico, requerimientos de software y arquitectura en el monorepo de Syverluma.",
        expected_output="Plan de arquitectura y viabilidad técnica de TI.",
        agent=cto_agent
    )
    t_cco = Task(
        description="Diseña la estrategia comercial, pricing y monetización para hacer exitosa la iniciativa.",
        expected_output="Estrategia de ventas y modelo comercial.",
        agent=cco_agent
    )
    t_cfo = Task(
        description="Analiza la estructura de costos (nube, comisiones, márgenes) y presupuesto financiero.",
        expected_output="Modelo financiero y proyecciones de rentabilidad.",
        agent=cfo_agent
    )
    t_coo = Task(
        description="Estructura el procedimiento operativo estándar (SOP) y el plan de ejecución práctica de la empresa.",
        expected_output="Procedimiento operativo estándar (SOP) consolidado.",
        agent=coo_agent
    )

    junta = Crew(
        agents=[ceo_agent, cto_agent, cco_agent, cfo_agent, coo_agent],
        tasks=[t_ceo, t_cto, t_cco, t_cfo, t_coo],
        process=Process.sequential,
        verbose=True
    )
    resultado = junta.kickoff()
    guardar_entregable("Junta_Directiva_Consolidada", objetivo_estrategico, str(resultado))
    return resultado

# ==============================================================================
# MENÚ INTERACTIVO EN CONSOLA
# ==============================================================================
def menu_principal():
    while True:
        print("\n" + "=" * 70)
        print("  🏢 CORPORACIÓN SYVERLUMA S.A.C. - ORQUESTADOR DE ÁREAS FUNCIONALES")
        print("=" * 70)
        print("Selecciona el área funcional a la que deseas despachar una misión:")
        print("  1. 👔 Gerencia General (CEO)          -> Estrategia y Expansión")
        print("  2. 💻 TI y Sistemas (CTO)             -> Código, Arquitectura y DevOps")
        print("  3. 📈 Ventas y Crecimiento (CCO)      -> Embudo Comercial y Pricing")
        print("  4. 💰 Contabilidad y Finanzas (CFO)   -> Costos Cloud y Rentabilidad")
        print("  5. ⚙️  Operaciones y Admin (COO)       -> Procedimientos (SOPs) y Logística")
        print("  6. 🌐 Junta Directiva Completa (Mesa) -> Misión Integral (Los 5 Departamentos)")
        print("  7. 📁 Abrir Carpeta de Entregables    -> Ver reportes generados")
        print("  8. ❌ Salir")
        print("-" * 70)

        opcion = input("Elige una opción [1-8]: ").strip()

        if opcion == '1':
            m = input("\n[CEO] Describe la misión estratégica: ").strip()
            if m: ejecutar_mision_gerencia(m)
        elif opcion == '2':
            m = input("\n[CTO] Describe la tarea de software/sistemas: ").strip()
            if m: ejecutar_mision_ti(m)
        elif opcion == '3':
            m = input("\n[CCO] Describe el objetivo comercial/ventas: ").strip()
            if m: ejecutar_mision_ventas(m)
        elif opcion == '4':
            m = input("\n[CFO] Describe el análisis financiero o de costos: ").strip()
            if m: ejecutar_mision_finanzas(m)
        elif opcion == '5':
            m = input("\n[COO] Describe el procedimiento o proceso a estandarizar: ").strip()
            if m: ejecutar_mision_operaciones(m)
        elif opcion == '6':
            m = input("\n[JUNTA] Describe el objetivo empresarial integral: ").strip()
            if m: ejecutar_mision_corporativa(m)
        elif opcion == '7':
            print(f"\nLos entregables se guardan en: {ENTREGABLES_DIR}")
            if sys.platform == 'win32':
                os.system(f'explorer "{ENTREGABLES_DIR}"')
        elif opcion == '8':
            print("\nCerrando sesión en la Matriz Syverluma. ¡Hasta pronto!\n")
            break
        else:
            print("\n[!] Opción inválida. Intenta nuevamente.")

def parsear_argumentos():
    parser = argparse.ArgumentParser(description="Orquestador Corporativo Syverluma S.A.C.")
    parser.add_argument('--area', choices=['gerencia', 'ti', 'ventas', 'finanzas', 'operaciones', 'junta'], help="Área funcional")
    parser.add_argument('--mision', type=str, help="Descripción de la misión a ejecutar")
    return parser.parse_args()

if __name__ == '__main__':
    args = parsear_argumentos()
    if args.area and args.mision:
        mapa_areas = {
            'gerencia': ejecutar_mision_gerencia,
            'ti': ejecutar_mision_ti,
            'ventas': ejecutar_mision_ventas,
            'finanzas': ejecutar_mision_finanzas,
            'operaciones': ejecutar_mision_operaciones,
            'junta': ejecutar_mision_corporativa,
        }
        funcion_ejecutora = mapa_areas.get(args.area)
        resultado = funcion_ejecutora(args.mision)
        print("\n=== ENTREGA FINAL ===")
        print(resultado)
    else:
        menu_principal()
