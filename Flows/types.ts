export interface FlowOptions {
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}
