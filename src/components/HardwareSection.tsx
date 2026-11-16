import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { hardware } from "../data/content";

export default function HardwareSection() {
  return (
    <section className="section" id="hardware">
      <div className="container">
        <SectionHead {...hardware} keyBase="hardware" />
        <ul className="hardware__grid">
          {hardware.components.map((c, i) => (
            <Reveal as="li" delay={i * 55} key={c.name}>
              <div className="hardware__chip">
                <span className="hardware__chip-icon">
                  <Icon name={c.icon} />
                </span>
                {c.name}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
