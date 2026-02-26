# Domain Primitives Reference

Condensed schemas from `prd/cantrip-domain-model.md`. Only the fields needed during idea-to-ICP decomposition.

## Product

```
Product {
  name: String
  one_liner: String              // ≤15 words
  capabilities: Vec<Tag>         // free-form: "time-tracking", "qbi", "mobile-first"
  format: ProductFormat
  stage: ProductStage
}
```

### ProductFormat
| Value | Description |
|-------|-------------|
| `SaaS` | Software-as-a-service, recurring revenue |
| `API` | Developer-facing service |
| `Marketplace` | Two-sided platform |
| `InfoProduct` | Course, ebook, template, community |
| `Service` | Done-for-you, consulting, agency |
| `Physical` | Physical product |
| `Hybrid` | Multiple formats combined |

### ProductStage
| Value | Description |
|-------|-------------|
| `Idea` | No code, no customers |
| `MVP` | Functional, <10 customers |
| `ProductMarket` | Evidence of fit |
| `Scale` | Optimizing, not searching |

## ICPSegment

```
ICPSegment {
  label: String                  // "Mom & Pop Landlords (3-10 doors)"
  pain: String                   // The core job-to-be-done / pain
  current_alternative: String    // What they do today
  trigger_events: Vec<Tag>       // When do they start looking?
  watering_holes: Vec<Tag>       // Where do they hang out?
  budget_band: BudgetBand
  decision_maker: DecisionMaker
}
```

### MarketType
| Value | Description |
|-------|-------------|
| `B2C` | Direct to consumer |
| `Prosumer` | Power users / hobbyists willing to pay |
| `B2B_SMB` | Small business (<50 employees) |
| `B2B_Mid` | Mid-market (50-500 employees) |
| `B2B_Enterprise` | Enterprise (500+ employees) |
| `B2B2C` | Sell to businesses who sell to consumers |

### BuyingModel
| Value | Description |
|-------|-------------|
| `SelfServe` | Sign up, pay, use. No human involved |
| `SalesAssisted` | Light-touch demo or onboarding call |
| `SalesLed` | Outbound-driven, multi-touch sales process |
| `Enterprise` | RFP, procurement, legal review |

### DecisionMaker
| Value | Description |
|-------|-------------|
| `Individual` | One person decides and pays |
| `Household` | Family/partner decision |
| `Team` | Small group consensus |
| `Committee` | Formal buying committee |
| `Champion` | Internal advocate navigating org |

### BudgetBand
Approximate willingness-to-pay ranges:
- **Micro**: <$10/mo — impulse buy, no deliberation
- **Low**: $10-50/mo — light consideration
- **Mid**: $50-200/mo — comparison shopping
- **High**: $200-1000/mo — serious evaluation
- **Enterprise**: $1000+/mo — formal procurement

## ValueProp

```
ValueProp {
  core_promise: String           // "X so that Y"
  differentiators: Vec<Differentiator>
  anti_positioning: Vec<String>  // What you are NOT
}

Differentiator {
  claim: String
  dimension: DiffDimension
}
```

### DiffDimension
| Value | When to use |
|-------|-------------|
| `Speed` | Faster than alternatives |
| `Price` | Cheaper than alternatives |
| `Quality` | Better output/results |
| `Simplicity` | Easier to use |
| `Integration` | Works with existing tools |
| `Support` | Better help/service |
| `Trust` | More reliable/secure |
| `Specialization` | Built specifically for this niche |

## Mapping to Cantrip Models

When generating output, map these domain primitives to existing Cantrip models:

| Domain Primitive | Cantrip Model | Field Mapping |
|---|---|---|
| `Product.name` | `ProjectModel.name` | Direct |
| `Product.one_liner` | `ProjectModel.description` | Direct |
| `ICPSegment.label` | `ICPModel.name` | Direct |
| `ICPSegment.pain` | `ICPModel.painPoints` | Array item |
| `ICPSegment.current_alternative` | `ICPModel.currentAlternatives` | Array item |
| `ICPSegment.budget_band` | `ICPModel.willingnessToPay` | String description |
| `ValueProp.core_promise` | `ValuePropositionModel.framing` | Direct |
| `ValueProp.differentiators` | `ValuePropositionModel.options` | As MultiOptionCandidate[] |
| Channel | `SocialWebEntryModel` | `platform`, `name`, `relevanceScore` |
