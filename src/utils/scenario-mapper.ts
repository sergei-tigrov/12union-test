import type { TestScenario, TestMode, RelationshipStatus } from '../types';

/**
 * Преобразует TestScenario в пару testMode и relationshipStatus
 */
export function mapScenarioToModes(scenario: TestScenario): {
  testMode: TestMode;
  relationshipStatus: RelationshipStatus;
} {
  switch (scenario) {
    case 'single_reality':
      return { testMode: 'self', relationshipStatus: 'single_past' };

    case 'single_potential':
      return { testMode: 'potential', relationshipStatus: 'single_potential' };

    case 'in_relationship_self':
      return { testMode: 'self', relationshipStatus: 'in_relationship' };

    case 'in_relationship_partner':
      return { testMode: 'partner_assessment', relationshipStatus: 'in_relationship' };

    case 'couple_independent':
      return { testMode: 'self', relationshipStatus: 'pair_together' };

    case 'couple_discussion':
      return { testMode: 'pair_discussion', relationshipStatus: 'pair_together' };

    default: {
      const _exhaustive: never = scenario;
      return _exhaustive;
    }
  }
}
